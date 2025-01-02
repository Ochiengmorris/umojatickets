"use client";

import { createMpesaPaymentRequest } from "@/actions/createMpesaPaymentRequest";
import { createStripeCheckoutSession } from "@/actions/createStripeCheckoutSession";
import { queryTransactionCheck } from "@/actions/queryTransactionCheck";
import EventCardCheckout from "@/components/EventCardCheckout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import mpesa_logo from "@/images/mpesa-Logo.png";
import stripe_logo from "@/images/stripe_logo.png";
import { cn, formatPhoneNumber } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const CheckOut = () => {
  const router = useRouter();
  const { user } = useUser();
  const params = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStkPushSent, setIsStkPushSent] = useState(false);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);

  const eventId = params.id as Id<"events">;

  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId: user?.id ?? "",
  });
  const handlePurchaseStripe = async () => {
    if (!user || !queuePosition || queuePosition.status !== "offered") {
      toast({
        variant: "destructive",
        title: "Oops! Sorry, try reseving again",
        description: "You took too long to purchase",
      });
      router.back();
      return;
    }

    try {
      setIsLoading(true);
      const { sessionUrl } = await createStripeCheckoutSession({
        eventId,
      });
      if (sessionUrl) {
        router.push(sessionUrl);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchaseMpesa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !queuePosition || queuePosition.status !== "offered") {
      toast({
        variant: "destructive",
        title: "Oops! Sorry, try reseving again",
        description: "You took too long to purchase",
      });
      router.back();
      return;
    }

    try {
      setIsLoading(true);

      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

      const response = await createMpesaPaymentRequest({
        eventId,
        phoneNumber: formattedPhoneNumber,
      });

      if (response.status === "ok") {
        setCheckoutId(response.data.checkoutRequestId);
        setIsStkPushSent(true);
        toast({
          title: "STK Push Sent",
          description: "Please check your phone to complete the transaction.",
        });
        setIsDialogOpen(false);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oops! Sorry, try again later",
        description: "An error occurred",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQueryTransaction = async () => {
    if (!checkoutId) return;

    try {
      setIsLoading(true);

      const result = await queryTransactionCheck({
        checkoutRequestId: checkoutId,
      });

      if (result.status === "ok") {
        toast({
          title: "Transaction Status",
          description: `Result: ${result.message}`,
        });
        setIsStkPushSent(false);
        router.replace("/tickets/purchase-success");
      } else {
        toast({
          variant: "destructive",
          title: "Query Failed",
          description: result.message || "Unable to query transaction status.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Query Failed",
        description: "An error occurred while querying the transaction.",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Select Payment Method</h1>
      <div className=" flex flex-col md:flex-row mb-4 gap-2 rounded-xl ">
        <EventCardCheckout eventId={eventId} motionkey={0.1} />
        <div className="mt-4 md:flex-1 flex flex-col lg:flex-row justify-start md:mt-0 gap-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger className={cn("flex flex-1")} asChild>
              <div className="p-2 bg-card cursor-pointer md:h-full text-card-foreground shadow hover:shadow-lg transition-all duration-300 flex items-center flex-col justify-center border rounded-xl hover:border-primary/30 overflow-hidden flex-1">
                <h1 className="text-xl font-semibold text-center">
                  {" "}
                  Pay With{" "}
                </h1>
                <div className="flex flex-col  items-center justify-center ">
                  <Image
                    src={mpesa_logo}
                    alt="mpesa logo"
                    className="w-auto h-auto object-cover"
                  />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Pay With Mpesa</DialogTitle>
                <DialogDescription>
                  Enter your phone number to proceed with the payment.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handlePurchaseMpesa}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-muted-foreground">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary/50 focus:border-primary/50 sm:text-sm sm:leading-5"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" className="font-semibold">
                    {isLoading ? "Initiating.." : "Pay Now"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <div
            onClick={handlePurchaseStripe}
            className="p-2 bg-card cursor-pointer text-card-foreground shadow hover:shadow-lg transition-all duration-300 flex items-center flex-col justify-center border rounded-xl hover:border-primary/30 overflow-hidden flex-1"
          >
            <h1 className="text-xl font-semibold text-center"> Pay With </h1>
            <div className="flex flex-col  items-center justify-center ">
              <Image
                src={stripe_logo}
                alt="stripe logo"
                className="w-auto h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      {isStkPushSent && (
        <div className="mt-4">
          <Button
            onClick={handleQueryTransaction}
            className="w-full md:w-auto font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <p>Checking...</p>
              </>
            ) : (
              "Check Transaction Status"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
export default CheckOut;
