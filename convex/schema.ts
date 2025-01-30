import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  events: defineTable({
    name: v.string(),
    description: v.string(),
    location: v.string(),
    eventDate: v.number(),
    price: v.number(),
    totalTickets: v.number(),
    userId: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    is_cancelled: v.optional(v.boolean()),
  })
    .index("by_user_id", ["userId"])
    .index("by_date", ["eventDate"]),
  tickets: defineTable({
    eventId: v.id("events"),
    userId: v.string(),
    purchasedAt: v.number(),
    status: v.union(
      v.literal("valid"),
      v.literal("used"),
      v.literal("refunded"),
      v.literal("cancelled")
    ),
    paymentIntentId: v.optional(v.string()),
    amount: v.optional(v.number()),
  })
    .index("by_event", ["eventId"])
    .index("by_event_status", ["eventId", "status"])
    .index("by_user", ["userId"])
    .index("by_user_event", ["userId", "eventId"])
    .index("by_payment_intent", ["paymentIntentId"]),

  waitingList: defineTable({
    eventId: v.id("events"),
    userId: v.string(),
    status: v.union(
      v.literal("waiting"),
      v.literal("offered"),
      v.literal("purchased"),
      v.literal("expired")
    ),
    offerExpiresAt: v.optional(v.number()),
  })
    .index("by_event_status", ["eventId", "status"])
    .index("by_user_event", ["userId", "eventId"])
    .index("by_user", ["userId"]),

  users: defineTable({
    name: v.string(),
    email: v.string(),
    userId: v.string(),
    stripeConnectId: v.optional(v.string()),
    isSeller: v.optional(v.boolean()),
    balance: v.optional(v.number()),
  })
    .index("by_user_id", ["userId"])
    .index("by_email", ["email"]),

  mpesaTransactions: defineTable({
    checkoutRequestId: v.string(),
    metadata: v.string(), // JSON string of MpesaCallbackMetaData
    amount: v.number(),
    expiresAt: v.string(), // ISO date string
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed")
    ),
    resultCode: v.optional(v.number()),
    resultDesc: v.optional(v.string()),
    mpesaReceiptNumber: v.optional(v.string()),
    transactionDate: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
  }).index("by_checkoutRequestId", ["checkoutRequestId"]),

  withdrawals: defineTable({
    userId: v.string(),
    amount: v.number(),
    requestedAt: v.number(), // Timestamp of when the withdrawal was requested
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed")
    ),
    transactionId: v.optional(v.string()), // External payment system transaction ID
    method: v.union(
      v.literal("mpesa"),
      v.literal("stripe"),
      v.literal("bank_transfer")
    ), // Withdrawal method
    processedAt: v.optional(v.number()), // Timestamp of when the withdrawal was processed
    metadata: v.optional(v.string()), // JSON string for any additional metadata
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_transaction_id", ["transactionId"]),
});
