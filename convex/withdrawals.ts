import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createWithdrawal = mutation({
  args: {
    userId: v.string(),
    amount: v.number(),

    requestedAt: v.string(),
    processedAt: v.optional(v.number()),
    metadata: v.optional(v.string()),
  },
  handler: async (ctx, { userId, amount, processedAt, metadata }) => {
    const id = await ctx.db.insert("withdrawals", {
      userId,
      amount,
      status: "pending",
      requestedAt: Date.now(),
      method: "mpesa",
      processedAt,
      metadata,
    });

    return id;
  },
});

export const getWithdrawalsForUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("withdrawals")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const updateWithdrawalStatus = mutation({
  args: {
    withdrawalId: v.id("withdrawals"),
    status: v.union(v.literal("completed"), v.literal("failed")),
  },
  handler: async (ctx, { withdrawalId, status }) => {
    await ctx.db.patch(withdrawalId, { status });
  },
});
