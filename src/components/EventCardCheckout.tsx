"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, StarIcon, Ticket } from "lucide-react";
import Image from "next/image";

import { cn, useStorageUrl } from "@/lib/utils";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import EventCardSkeleton from "./EventCardSkeleton";
import { Card } from "./ui/card";

const EventCardCheckout = ({
  eventId,
  motionkey,
}: {
  eventId: Id<"events">;
  motionkey: number;
}) => {
  const { user } = useUser();
  // const router = useRouter();
  const event = useQuery(api.events.getById, { eventId });

  const availability = useQuery(api.events.getEventAvailability, { eventId });
  // const userTicket = useQuery(api.tickets.getUserTicketForEvent, {
  //   eventId,
  //   userId: user?.id ?? "",
  // });
  // const queuePosition = useQuery(api.waitingList.getQueuePosition, {
  //   eventId,
  //   userId: user?.id ?? "",
  // });

  const imageUrl = useStorageUrl(event?.imageStorageId);

  if (!event || !availability) {
    return <EventCardSkeleton />;
  }

  const isPastEvent = event.eventDate < Date.now();

  const isEventOwner = user?.id === event?.userId;

  return (
    <Card
      className={cn(
        " relative bg-card self-center  text-card-foreground max-w-[448px] shadow rounded-xl hover:shadow-lg transition-all duration-300 border overflow-hidden"
      )}
    >
      <motion.div
        className={`relative ${
          isPastEvent ? "opacity-75 hover:opacity-100" : ""
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: motionkey * 0.2, // Delay depends on the index
          duration: 0.5, // Duration of the animation
        }}
      >
        {/* Event Image */}
        {imageUrl && (
          <div className="relative w-full h-48">
            <Image
              src={imageUrl}
              alt={event.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}

        <div className={`p-6 ${imageUrl ? "relative" : ""}`}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex flex-col items-start gap-2">
                {isEventOwner && (
                  <span className="inline-flex items-center gap-1 bg-[#00c9aa]/90 text-gray-950 px-2 py-1 rounded-full text-xs font-medium">
                    <StarIcon className="w-3 h-3" />
                    Your Event
                  </span>
                )}

                <h2 className="text-xl md:text-2xl font-bold text-card-foreground">
                  {event.name}
                </h2>
              </div>
              {isPastEvent && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground shadow mt-2">
                  Past Event
                </span>
              )}
            </div>

            {/* Price Tag */}
            <div className="flex flex-col items-end gap-2 ml-4 shrink-0">
              <span
                className={`px-4 py-1.5 font-semibold rounded-full ${
                  isPastEvent
                    ? "bg-gray-200 text-gray-500"
                    : "bg-green-50 text-green-700"
                }`}
              >
                <span className="text-xs">Ksh </span> {event.price.toFixed(2)}
              </span>
              {availability.purchasedCount >= availability.totalTickets && (
                <span className="px-4 py-1.5 bg-red-50 text-red-700 font-semibold rounded-full text-sm">
                  Sold Out
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center text-card-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm md:text-base">{event.location}</span>
            </div>

            <div className="flex items-center text-card-foreground">
              <CalendarDays className="w-4 h-4 mr-2" />
              <span className="text-sm md:text-base">
                {new Date(event.eventDate).toLocaleDateString()}{" "}
                {isPastEvent && "(Ended)"}
              </span>
            </div>

            <div className="flex items-center text-card-foreground">
              <Ticket className="w-4 h-4 mr-2" />
              <span className="text-sm md:text-base">
                {availability.totalTickets - availability.purchasedCount} /{" "}
                {availability.totalTickets} available
                {!isPastEvent && availability.activeOffers > 0 && (
                  <span className="text-amber-600 text-sm ml-2">
                    ({availability.activeOffers}{" "}
                    {availability.activeOffers === 1 ? "person" : "people"}{" "}
                    trying to buy)
                  </span>
                )}
              </span>
            </div>
          </div>

          <p className="mt-4 text-card-foreground text-sm line-clamp-2">
            {event.description}
          </p>
        </div>
      </motion.div>
    </Card>
  );
};
export default EventCardCheckout;
