import { getConvexClient } from "@/lib/convex";
import { api } from "../../../../../convex/_generated/api";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const checkoutRequestId = url.searchParams.get("checkoutRequestId");

  if (!checkoutRequestId) {
    return new Response("Missing CheckoutRequestID", { status: 400 });
  }

  const convex = getConvexClient();

  try {
    const transaction = await convex.query(
      api.mpesaTransactions.getByCheckoutRequestId,
      { checkoutRequestId }
    );
    if (!transaction) {
      return new Response("Transaction not found", { status: 404 });
    }

    return NextResponse.json({ transaction });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return new Response("Error fetching transaction", { status: 500 });
  }
}
