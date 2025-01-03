"use server";

import { getConvexClient } from "@/lib/convex";
import { sendStkPush } from "@/lib/mpesa";
import { auth } from "@clerk/nextjs/server";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { DURATIONS } from "../../convex/constants";

export type MpesaCallbackMetaData = {
  eventId: Id<"events">;
  userId: string;
  waitingListId: Id<"waitingList">;
};

export async function createMpesaPaymentRequest({
  eventId,
  phoneNumber,
}: {
  eventId: Id<"events">;
  phoneNumber: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const convex = getConvexClient();

  // Get event details
  const event = await convex.query(api.events.getById, { eventId });
  if (!event) throw new Error("Event not found");

  // Get waiting list entry
  const queuePosition = await convex.query(api.waitingList.getQueuePosition, {
    eventId,
    userId,
  });

  if (!queuePosition || queuePosition.status !== "offered") {
    throw new Error("No valid ticket offer found");
  }

  if (!queuePosition.offerExpiresAt) {
    throw new Error("Ticket offer has no expiration date");
  }

  const metadata: MpesaCallbackMetaData = {
    eventId,
    userId,
    waitingListId: queuePosition._id,
  };

  // Create Mpesa STK Push request
  try {
    const stkPushResponse = await sendStkPush(phoneNumber, event.price);

    if (!stkPushResponse || !stkPushResponse.CheckoutRequestID) {
      throw new Error("Failed to initiate Mpesa payment");
    }

    // Store the metadata and CheckoutRequestID in your database
    await convex.mutation(api.mpesaTransactions.create, {
      checkoutRequestId: stkPushResponse.CheckoutRequestID,
      metadata: JSON.stringify(metadata),
      amount: event.price,
      expiresAt: new Date(Date.now() + DURATIONS.TICKET_OFFER).toISOString(),
    });

    return {
      status: "ok",
      data: {
        checkoutRequestId: stkPushResponse.CheckoutRequestID,
        responseCode: stkPushResponse.ResponseCode,
      },
    };
  } catch (error) {
    console.error("Error initiating Mpesa payment:", error);
    throw new Error("Failed to initiate Mpesa payment");
  }
}
