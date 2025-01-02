"use server";

import { getConvexClient } from "@/lib/convex";
import { MpesaCredentials } from "@/lib/mpesa";
import { getAccessToken } from "@/middleware";
import { auth } from "@clerk/nextjs/server";
import { api } from "../../convex/_generated/api";

const mpesaCredentials: MpesaCredentials = {
  consumerKey: process.env.MPESA_CONSUMER_KEY!,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
  passkey: process.env.MPESA_PASSKEY!,
  shortcode: process.env.MPESA_SHORTCODE!,
};

export async function queryTransactionCheck({
  checkoutRequestId,
}: {
  checkoutRequestId: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");
  const accessToken = await getAccessToken();

  const url = "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query";

  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, -3);

  const password = Buffer.from(
    `${mpesaCredentials.shortcode}${mpesaCredentials.passkey}${timestamp}`
  ).toString("base64");

  const requestBody = {
    BusinessShortCode: mpesaCredentials.shortcode,
    Password: password,
    Timestamp: timestamp,
    CheckoutRequestID: checkoutRequestId,
  };

  const convex = getConvexClient();
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (data.ResultCode === "0") {
      const transaction = await convex.query(
        api.mpesaTransactions.getByCheckoutRequestId,
        {
          checkoutRequestId,
        }
      );

      if (!transaction) {
        console.error(
          "Transaction not found for CheckoutRequestID:",
          checkoutRequestId
        );
        return { message: "Transaction not found", status: 404 };
      }

      const metadata = JSON.parse(transaction.metadata);

      await convex.mutation(api.mpesaTransactions.updateStatus, {
        checkoutRequestId: data.CheckoutRequestID,
        status: data.ResultCode === "0" ? "completed" : "failed",
        resultCode: Number(data.ResultCode),
        resultDesc: data.ResultDesc,
      });

      // Process the ticket purchase
      const result = await convex.mutation(api.events.purchaseMpesaTicket, {
        eventId: metadata.eventId,
        userId: metadata.userId,
        waitingListId: metadata.waitingListId,
        paymentInfo: {
          amount: transaction.amount,
          checkoutRequestId: data.CheckoutRequestID,
        },
      });
      console.log("Purchase ticket mutation completed:", result);

      return {
        status: "ok",
        message: data.ResultDesc,
      };
    } else {
      try {
        // Update the transaction status to failed
        await convex.mutation(api.mpesaTransactions.updateStatus, {
          checkoutRequestId: data.CheckoutRequestID,
          status: "failed",
          resultCode: Number(data.ResultCode),
          resultDesc: data.ResultDesc,
        });

        return {
          status: "failed",
          message: data.ResultDesc,
        };
      } catch (error) {
        console.error("Error updating ticket payment status:", error);
        return { message: "Error updating ticket payment status", status: 500 };
      }
    }
  } catch (error: any) {
    console.error(
      "Error querying transaction:",
      error.response?.data || error.message
    );
    return {
      status: 500,
      message: error.response?.data || "Query failed",
    };
  }
}
