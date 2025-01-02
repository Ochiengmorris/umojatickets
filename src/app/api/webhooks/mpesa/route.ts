import { getConvexClient } from "@/lib/convex";
import { NextResponse } from "next/server";
import { api } from "../../../../../convex/_generated/api";

interface MpesaCallback {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: number | string;
        }>;
      };
    };
  };
}

export async function POST(req: Request) {
  console.log("Mpesa callback received");

  const body = await req.text();

  let mpesaCallback: MpesaCallback;

  try {
    console.log("Attempting to parse Mpesa callback");
    mpesaCallback = JSON.parse(body);
    console.log("Mpesa callback parsed successfully");
  } catch (err) {
    console.error("Mpesa callback parsing failed:", err);
    return new Response(`Mpesa Callback Error: ${(err as Error).message}`, {
      status: 400,
    });
  }

  const convex = getConvexClient();

  const { stkCallback } = mpesaCallback.Body;
  const { ResultCode, ResultDesc, CheckoutRequestID } = stkCallback;

  // Retrieve the stored transaction
  const transaction = await convex.query(
    api.mpesaTransactions.getByCheckoutRequestId,
    {
      checkoutRequestId: CheckoutRequestID,
    }
  );

  if (!transaction) {
    console.error(
      "Transaction not found for CheckoutRequestID:",
      CheckoutRequestID
    );
    return new Response("Transaction not found", { status: 404 });
  }

  const metadata = JSON.parse(transaction.metadata);

  if (ResultCode === 0) {
    console.log("Processing successful Mpesa payment");

    if (stkCallback.CallbackMetadata) {
      const getItemValue = (name: string) => {
        const item = stkCallback.CallbackMetadata!.Item.find(
          (item) => item.Name === name
        );
        return item ? item.Value : null;
      };

      const amount = getItemValue("Amount") as number;
      const mpesaReceiptNumber = getItemValue("MpesaReceiptNumber") as string;
      const transactionDate = getItemValue("TransactionDate") as string;
      const phoneNumber = getItemValue("PhoneNumber") as string;

      try {
        // Update the transaction status
        await convex.mutation(api.mpesaTransactions.updateStatus, {
          checkoutRequestId: CheckoutRequestID,
          status: "completed",
          resultCode: ResultCode,
          resultDesc: ResultDesc,
          mpesaReceiptNumber,
          transactionDate,
          phoneNumber,
        });

        // Process the ticket purchase
        const result = await convex.mutation(api.events.purchaseMpesaTicket, {
          eventId: metadata.eventId,
          userId: metadata.userId,
          waitingListId: metadata.waitingListId,
          paymentInfo: {
            transactionId: mpesaReceiptNumber,
            amount: amount,
            phoneNumber: phoneNumber,
            transactionDate: transactionDate,
            checkoutRequestId: CheckoutRequestID,
          },
        });
        console.log("Purchase ticket mutation completed:", result);
      } catch (error) {
        console.error("Error processing Mpesa callback:", error);
        return new Response("Error processing Mpesa callback", { status: 500 });
      }
    } else {
      console.error(
        "CallbackMetadata is missing in the successful transaction"
      );
      return new Response("Incomplete Mpesa callback data", { status: 400 });
    }
  } else {
    console.log(
      `Mpesa payment failed. ResultCode: ${ResultCode}, ResultDesc: ${ResultDesc}`
    );
    try {
      // Update the transaction status to failed
      await convex.mutation(api.mpesaTransactions.updateStatus, {
        checkoutRequestId: CheckoutRequestID,
        status: "failed",
        resultCode: ResultCode,
        resultDesc: ResultDesc,
      });
    } catch (error) {
      console.error("Error updating ticket payment status:", error);
      return new Response("Error updating ticket payment status", {
        status: 500,
      });
    }
  }

  return NextResponse.json({ message: "Callback received successfully" });
}
