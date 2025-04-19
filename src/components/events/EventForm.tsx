"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn, useStorageUrl } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { Loader2, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

const ticketSchema = z.object({
  name: z.string().min(1, "Ticket name is required"),
  price: z.number().min(0, "Price must be 0 or greater"),
  totalTickets: z.number().min(1, "Must have at least 1 ticket"),
});

const formSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  eventDate: z
    .date()
    .min(
      new Date(new Date().setHours(0, 0, 0, 0)),
      "Event date must be in the future"
    ),
  time: z.string().min(1, "Time is required"),
  ticketTypes: z
    .array(ticketSchema)
    .min(1, "At least one ticket type required"),
});

type FormData = z.infer<typeof formSchema>;

interface InitialEventData {
  _id: Id<"events">;
  name: string;
  description: string;
  location: string;
  eventDate: number;
  imageStorageId?: Id<"_storage">;
  time: string;
  ticketTypes: {
    _id: Id<"ticketTypes">;
    name: string;
    price: number;
    totalTickets: number;
  }[];
}

interface EventFormProps {
  mode: "create" | "edit";
  initialData?: InitialEventData;
}

export default function EventForm({ mode, initialData }: EventFormProps) {
  const { user } = useUser();
  const createEvent = useMutation(api.events.create);
  const updateEvent = useMutation(api.events.updateEvent);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const currentImageUrl = useStorageUrl(initialData?.imageStorageId);

  const userDetails = useQuery(api.users.getUserById, {
    userId: user?.id || "",
  });

  // Image upload
  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const updateEventImage = useMutation(api.storage.updateEventImage);
  const deleteImage = useMutation(api.storage.deleteImage);

  const [removedCurrentImage, setRemovedCurrentImage] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      location: initialData?.location ?? "",
      eventDate: initialData ? new Date(initialData.eventDate) : new Date(),
      time: initialData?.time ?? "",
      ticketTypes: initialData?.ticketTypes ?? [
        { name: "", price: 0, totalTickets: 1 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ticketTypes",
  });

  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  const generateDescription = async () => {
    // if (!form.getValues("name")) {
    //   toast({
    //     variant: "destructive",
    //     title: "Event name required",
    //     description:
    //       "Please enter an event name first to generate a description.",
    //   });
    //   return;
    // }

    setIsGeneratingDescription(true);
    try {
      toast({
        title: "Generate with AI",
        description: "Coming soon!",
      });
      // const response = await fetch("/api/generate-description", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     eventName: form.getValues("name"),
      //     eventType: "event", // You can make this dynamic based on event type
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to generate description");
      // }

      // const data = await response.json();
      // form.setValue("description", data.description);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate description. Please try again.",
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  async function onSubmit(values: FormData) {
    if (!user?.id) return;

    if (!userDetails) return;

    if (userDetails.isSeller !== true) {
      toast({
        variant: "destructive",
        title: "Oops! Sorry",
        description: "Only sellers can create or update events.",
      });
      return;
    }

    if (!values.ticketTypes || values.ticketTypes.length === 0) {
      toast({
        variant: "destructive",
        title: "Ticket Type Required",
        description: "At least one ticket type must be added.",
      });
      return;
    }

    startTransition(async () => {
      try {
        let imageStorageId = null;

        // Handle image changes
        if (selectedImage) {
          // Upload new image
          imageStorageId = await handleImageUpload(selectedImage);
        }

        // Handle image deletion/update in edit mode
        if (mode === "edit" && initialData?.imageStorageId) {
          if (removedCurrentImage || selectedImage) {
            // Delete old image from storage
            await deleteImage({
              storageId: initialData.imageStorageId,
            });
          }
        }

        if (mode === "create") {
          const eventId = await createEvent({
            ...values,
            userId: user.id,
            eventDate: values.eventDate.getTime(),
          });

          if (imageStorageId) {
            await updateEventImage({
              eventId,
              storageId: imageStorageId as Id<"_storage">,
            });
          }

          router.push(`/event/${eventId}`);
        } else {
          // Ensure initialData exists before proceeding with update
          if (!initialData) {
            throw new Error("Initial event data is required for updates");
          }

          // Update event details
          await updateEvent({
            eventId: initialData._id,
            ...values,
            eventDate: values.eventDate.getTime(),
            // time: values.time,
            ticketTypes: values.ticketTypes.map((type, index) => ({
              id: initialData.ticketTypes[index]?._id,
              name: type.name,
              price: type.price,
              totalTickets: type.totalTickets,
            })),
          });

          // Update image - this will now handle both adding new image and removing existing image
          if (imageStorageId || removedCurrentImage) {
            await updateEventImage({
              eventId: initialData._id,
              // If we have a new image, use its ID, otherwise if we're removing the image, pass null
              storageId: imageStorageId
                ? (imageStorageId as Id<"_storage">)
                : null,
            });
          }

          router.push(`/event/${initialData._id}`);
          toast({
            title: "Event updated",
            description: "Your event has been successfully updated.",
          });
        }
      } catch (error: any) {
        console.error("Failed to handle event:", error);
        const match = error?.message?.match(/Cannot reduce.*sold\)/);
        const errorMessage = match ? match[0] : "An unexpected error occurred.";
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: errorMessage,
        });
      }
    });
  }

  async function handleImageUpload(file: File): Promise<string | null> {
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      return storageId;
    } catch (error) {
      console.error("Failed to upload image:", error);
      return null;
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Form fields */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={cn("text-muted-foreground")}>
                  Event Name
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className={cn("text-muted-foreground")}>
                    Description
                  </FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateDescription}
                    disabled={isGeneratingDescription}
                    className="flex items-center gap-2"
                  >
                    {isGeneratingDescription ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </div>
                <FormControl>
                  <Textarea {...field}></Textarea>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn("text-muted-foreground")}>
                    Location
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <div className="grid grid-cols-2 gap-4"> */}
            <FormField
              control={form.control}
              name="eventDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn("text-muted-foreground")}>
                    Event Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      onChange={(e) => {
                        field.onChange(
                          e.target.value ? new Date(e.target.value) : null
                        );
                      }}
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
                          : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn("text-muted-foreground")}>
                    Event Time
                  </FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* </div> */}
          </div>

          <div className="">
            <label className="block text-sm text-muted-foreground  font-medium mb-2">
              Ticket Types{" "}
              <span className="text-muted-foreground italic">
                {" "}
                ( name, price, total-Tickets )
              </span>
            </label>
            {fields.map((ticket, index) => (
              <div key={ticket.id} className="flex gap-4 mb-2 items-center">
                <Input
                  {...form.register(`ticketTypes.${index}.name`)}
                  placeholder="Ticket Name"
                />
                <Input
                  type="number"
                  {...form.register(`ticketTypes.${index}.price`, {
                    valueAsNumber: true,
                  })}
                  placeholder="Price"
                />
                <Input
                  type="number"
                  {...form.register(`ticketTypes.${index}.totalTickets`, {
                    valueAsNumber: true,
                  })}
                  placeholder="Total Tickets"
                />
                <Button type="button" onClick={() => remove(index)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => append({ name: "", price: 0, totalTickets: 1 })}
            >
              Add Ticket Type
            </Button>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <label className="block text-sm  font-medium text-muted-foreground">
              Event Image
            </label>
            <div className="mt-1 flex items-center gap-4">
              {imagePreview || (!removedCurrentImage && currentImageUrl) ? (
                <div className="relative w-32 aspect-square bg-gray-100 rounded-lg">
                  <Image
                    src={imagePreview || currentImageUrl!}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                      setRemovedCurrentImage(true);
                      if (imageInput.current) {
                        imageInput.current.value = "";
                      }
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={imageInput}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-jmprimary file:text-gray-950
                    hover:file:cursor-pointer hover:file:bg-jmprimary/80  transition-colors"
                />
              )}
            </div>
            {mode === "edit" &&
              initialData?.imageStorageId &&
              !removedCurrentImage && (
                <p className="text-sm text-muted-foreground">
                  Current image will be kept if no new image is selected
                </p>
              )}
          </div>
        </div>

        <Button
          type="submit"
          onSubmit={form.handleSubmit(onSubmit)}
          disabled={isPending}
          className="place-self-end font-semibold py-6 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {mode === "create" ? "Creating Event..." : "Updating Event..."}
            </>
          ) : mode === "create" ? (
            "Create Event"
          ) : (
            "Update Event"
          )}
        </Button>
      </form>
    </Form>
  );
}
