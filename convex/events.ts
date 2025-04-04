import { MINUTE, RateLimiter } from "@convex-dev/rate-limiter";
import { ConvexError, v } from "convex/values";
import { components, internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { DURATIONS, TICKET_STATUS, WAITING_LIST_STATUS } from "./constants";
import { processQueue } from "./waitingList";

export type Metrics = {
  soldTickets: number;
  refundedTickets: number;
  cancelledTickets: number;
  revenue: number;
};

// Initialize rate limiter
const rateLimiter = new RateLimiter(components.rateLimiter, {
  queueJoin: {
    kind: "fixed window",
    rate: 3, // 3 joins allowed
    period: 30 * MINUTE, // in 30 minutes
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("is_cancelled"), undefined))
      .collect();
  },
});

export const getById = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    return await ctx.db.get(eventId);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    location: v.string(),
    eventDate: v.number(), // Store as timestamp
    // price: v.number(),
    // totalTickets: v.optional(v.number()),
    userId: v.string(),
    ticketTypes: v.array(
      v.object({
        name: v.string(),
        price: v.number(),
        totalTickets: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const ticketTypes = args.ticketTypes;

    const eventId = await ctx.db.insert("events", {
      name: args.name,
      description: args.description,
      location: args.location,
      eventDate: args.eventDate,
      // price: args.price,
      // totalTickets: args.totalTickets,
      userId: args.userId,
    });

    for (const ticketType of ticketTypes) {
      await ctx.db.insert("ticketTypes", {
        eventId,
        name: ticketType.name,
        price: ticketType.price,
        totalTickets: ticketType.totalTickets,
      });
    }
    return eventId;
  },
});

// Helper function to check ticket availability for an event
export const checkAvailability = query({
  args: {
    eventId: v.id("events"),
    ticketType: v.id("ticketTypes"),
  },
  handler: async (ctx, { eventId, ticketType }) => {
    const event = await ctx.db.get(eventId);
    if (!event) throw new Error("Event not found");

    const ticket = await ctx.db.get(ticketType);
    if (!ticket) throw new Error("Ticket type not found");

    // Count total purchased tickets
    const purchasedCount = await ctx.db
      .query("tickets")
      .withIndex("by_event_ticket_id", (q) =>
        q.eq("eventId", eventId).eq("ticketTypeId", ticketType)
      )
      .collect()
      .then(
        (tickets) =>
          tickets.filter(
            (t) =>
              t.status === TICKET_STATUS.VALID ||
              t.status === TICKET_STATUS.USED
          ).length
      );

    // Count current valid offers
    const now = Date.now();
    const activeOffers = await ctx.db
      .query("waitingList")
      .withIndex("by_event_ticket_type_status", (q) =>
        q
          .eq("eventId", eventId)
          .eq("ticketTypeId", ticketType)
          .eq("status", WAITING_LIST_STATUS.OFFERED)
      )
      .collect()
      .then((entries) => entries.filter((e) => (e.offerExpiresAt ?? 0) > now));

    // sum up the count field of each entry in the active offers to get all tickets in active offers
    const activeOffersLength = activeOffers.reduce(
      (acc, cur) => acc + cur.count,
      0
    );

    // Calculate available spots
    const availableSpots =
      (ticket.totalTickets ?? 0) - (purchasedCount + activeOffersLength);

    return {
      available: availableSpots > 0,
      availableSpots,
      totalTickets: ticket.totalTickets,
      purchasedCount,
      activeOffers: activeOffersLength,
    };
  },
});

// Join waiting list for an event
export const joinWaitingList = mutation({
  // Function takes an event ID and user ID as arguments
  args: {
    eventId: v.id("events"),
    userId: v.string(),
    ticketTypeId: v.id("ticketTypes"),
    selectedCount: v.number(),
  },
  handler: async (ctx, { eventId, userId, ticketTypeId, selectedCount }) => {
    // Rate limit check
    const status = await rateLimiter.limit(ctx, "queueJoin", { key: userId });
    if (!status.ok) {
      throw new ConvexError(
        `You've joined the waiting list too many times. Please wait ${Math.ceil(
          status.retryAfter / (60 * 1000)
        )} minutes before trying again.`
      );
    }

    // First check if user already has an active entry in waiting list for this event
    // Active means any status except EXPIRED
    const existingEntry = await ctx.db
      .query("waitingList")
      .withIndex("by_user_event", (q) =>
        q.eq("userId", userId).eq("eventId", eventId)
      )
      .filter((q) => q.neq(q.field("status"), WAITING_LIST_STATUS.EXPIRED))
      .first();

    // Don't allow duplicate entries
    if (existingEntry) {
      throw new Error("Already in waiting list for this event");
    }

    // Verify the event exists
    const event = await ctx.db.get(eventId);
    if (!event) throw new Error("Event not found");

    // Verify the ticket type exists and is available
    const ticketType = await ctx.db.get(ticketTypeId);
    if (!ticketType) throw new Error("Ticket type not found");

    // Check if there are any available tickets right now
    const { availableSpots } = await checkAvailability(ctx, {
      eventId,
      ticketType: ticketTypeId,
    });

    const now = Date.now();

    // Check if there are enough tickets available
    if (availableSpots >= selectedCount) {
      // If tickets are available, create an offer entry
      const waitingListId = await ctx.db.insert("waitingList", {
        eventId,
        userId,
        ticketTypeId,
        count: selectedCount,
        status: WAITING_LIST_STATUS.OFFERED, // Mark as offered
        offerExpiresAt: now + DURATIONS.TICKET_OFFER, // Set expiration time
      });

      // Schedule a job to expire this offer after the offer duration
      await ctx.scheduler.runAfter(
        DURATIONS.TICKET_OFFER,
        internal.waitingList.expireOffer,
        {
          waitingListId,
          eventId,
        }
      );
    } else if (availableSpots < selectedCount && selectedCount === 1) {
      // If no tickets available, add to waiting list
      await ctx.db.insert("waitingList", {
        eventId,
        userId,
        ticketTypeId,
        count: selectedCount,
        status: WAITING_LIST_STATUS.WAITING, // Mark as waiting
      });
    } else if (availableSpots < selectedCount && availableSpots === 1) {
      return {
        success: false,
        message: `Only ${availableSpots} ticket${availableSpots === 1 ? "" : "s"} remaining.`,
      };
    } else {
      return {
        success: false,
        message: `Only ${availableSpots} ticket${availableSpots === 1 ? "" : "s"} remaining. Reduce your number of tickets to 1 to be added to the waiting list`,
      };
    }

    // Return appropriate status message
    return {
      success: true,
      status:
        availableSpots >= selectedCount
          ? WAITING_LIST_STATUS.OFFERED // If available, status is offered
          : WAITING_LIST_STATUS.WAITING, // If not available, status is waiting
      message:
        availableSpots >= selectedCount
          ? "Ticket offered - you have 30 minutes to purchase"
          : "Added to waiting list - you'll be notified when a ticket becomes available",
    };
  },
});

// Purchase ticket
export const purchaseTicket = mutation({
  args: {
    eventId: v.id("events"),
    userId: v.string(),
    waitingListId: v.id("waitingList"),
    paymentInfo: v.object({
      paymentIntentId: v.string(),
      amount: v.number(),
    }),
  },
  handler: async (ctx, { eventId, userId, waitingListId, paymentInfo }) => {
    console.log("Starting purchaseTicket handler", {
      eventId,
      userId,
      waitingListId,
    });

    // Verify waiting list entry exists and is valid
    const waitingListEntry = await ctx.db.get(waitingListId);
    console.log("Waiting list entry:", waitingListEntry);

    if (!waitingListEntry) {
      console.error("Waiting list entry not found");
      throw new Error("Waiting list entry not found");
    }

    if (waitingListEntry.status !== WAITING_LIST_STATUS.OFFERED) {
      console.error("Invalid waiting list status", {
        status: waitingListEntry.status,
      });
      throw new Error(
        "Invalid waiting list status - ticket offer may have expired"
      );
    }

    if (waitingListEntry.userId !== userId) {
      console.error("User ID mismatch", {
        waitingListUserId: waitingListEntry.userId,
        requestUserId: userId,
      });
      throw new Error("Waiting list entry does not belong to this user");
    }

    // Verify event exists and is active
    const event = await ctx.db.get(eventId);
    console.log("Event details:", event);

    if (!event) {
      console.error("Event not found", { eventId });
      throw new Error("Event not found");
    }

    if (event.is_cancelled) {
      console.error("Attempted purchase of cancelled event", { eventId });
      throw new Error("Event is no longer active");
    }

    try {
      console.log("Creating ticket with payment info", paymentInfo);
      // Create ticket with payment info
      await ctx.db.insert("tickets", {
        eventId,
        userId,
        ticketTypeId: waitingListEntry.ticketTypeId,
        count: waitingListEntry.count,
        purchasedAt: Date.now(),
        status: TICKET_STATUS.VALID,
        paymentIntentId: paymentInfo.paymentIntentId,
        amount: paymentInfo.amount,
      });

      console.log("Updating waiting list status to purchased");
      await ctx.db.patch(waitingListId, {
        status: WAITING_LIST_STATUS.PURCHASED,
      });

      console.log("Processing queue for next person");
      // Process queue for next person
      await processQueue(ctx, {
        eventId,
        ticketTypeId: waitingListEntry.ticketTypeId,
      });

      console.log("Purchase ticket completed successfully");
    } catch (error) {
      console.error("Failed to complete ticket purchase:", error);
      throw new Error(`Failed to complete ticket purchase: ${error}`);
    }
  },
});

export const purchaseMpesaTicket = mutation({
  args: {
    eventId: v.id("events"),
    userId: v.string(),
    waitingListId: v.id("waitingList"),
    paymentInfo: v.object({
      transactionId: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      transactionDate: v.optional(v.string()),
      amount: v.number(),
      checkoutRequestId: v.string(),
    }),
  },
  handler: async (ctx, { eventId, userId, waitingListId, paymentInfo }) => {
    console.log("Starting purchaseTicket handler", {
      eventId,
      userId,
      waitingListId,
    });

    // Verify waiting list entry exists and is valid
    const waitingListEntry = await ctx.db.get(waitingListId);
    console.log("Waiting list entry:", waitingListEntry);

    if (!waitingListEntry) {
      console.error("Waiting list entry not found");
      throw new Error("Waiting list entry not found");
    }

    if (waitingListEntry.status !== WAITING_LIST_STATUS.OFFERED) {
      console.error("Invalid waiting list status", {
        status: waitingListEntry.status,
      });
      throw new Error(
        "Invalid waiting list status - ticket offer may have expired"
      );
    }

    if (waitingListEntry.userId !== userId) {
      console.error("User ID mismatch", {
        waitingListUserId: waitingListEntry.userId,
        requestUserId: userId,
      });
      throw new Error("Waiting list entry does not belong to this user");
    }

    // Verify event exists and is active
    const event = await ctx.db.get(eventId);
    console.log("Event details:", event);

    if (!event) {
      console.error("Event not found", { eventId });
      throw new Error("Event not found");
    }

    if (event.is_cancelled) {
      console.error("Attempted purchase of cancelled event", { eventId });
      throw new Error("Event is no longer active");
    }

    try {
      console.log("Creating ticket with payment info", paymentInfo);
      // Create ticket with payment info
      await ctx.db.insert("tickets", {
        eventId,
        userId,
        ticketTypeId: waitingListEntry.ticketTypeId,
        count: waitingListEntry.count,
        purchasedAt: Date.now(),
        status: TICKET_STATUS.VALID,
        paymentIntentId: paymentInfo.checkoutRequestId,
        amount: paymentInfo.amount,
      });

      console.log("Updating waiting list status to purchased");
      await ctx.db.patch(waitingListId, {
        status: WAITING_LIST_STATUS.PURCHASED,
      });

      console.log("Processing queue for next person");
      // Process queue for next person
      await processQueue(ctx, {
        eventId,
        ticketTypeId: waitingListEntry.ticketTypeId,
      });

      console.log("Purchase ticket completed successfully");
    } catch (error) {
      console.error("Failed to complete ticket purchase:", error);
      throw new Error(`Failed to complete ticket purchase: ${error}`);
    }
  },
});

// Get user's tickets with event information
export const getUserTickets = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const tickets = await ctx.db
      .query("tickets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const ticketsWithEvents = await Promise.all(
      tickets.map(async (ticket) => {
        const event = await ctx.db.get(ticket.eventId);
        return {
          ...ticket,
          event,
        };
      })
    );

    return ticketsWithEvents;
  },
});

// Get user's waiting list entries with event information
export const getUserWaitingList = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const entries = await ctx.db
      .query("waitingList")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const entriesWithEvents = await Promise.all(
      entries.map(async (entry) => {
        const event = await ctx.db.get(entry.eventId);
        return {
          ...entry,
          event,
        };
      })
    );

    // console.log(entriesWithEvents);

    return entriesWithEvents;
  },
});

// // Get user's waiting list entry for an event
// export const getUserWaitingListForEvent = query({
//   args: { userId: v.string(), eventId: v.id("events") },
//   handler: async (ctx, { userId, eventId }) => {
//     const entrys = await ctx.db
//       .query("waitingList")
//       .withIndex("by_user_event", (q) =>
//         q.eq("userId", userId).eq("eventId", eventId)
//       )
//       .collect()
//       .then((waitingList) =>
//         waitingList.filter(
//           (e) =>
//             e.status !== WAITING_LIST_STATUS.PURCHASED &&
//             e.status !== WAITING_LIST_STATUS.EXPIRED
//         )
//       );
//     return entrys;
//   },
// });

export const getEventAvailability = query({
  args: { eventId: v.id("events"), ticketTypeId: v.id("ticketTypes") },
  handler: async (ctx, { eventId, ticketTypeId }) => {
    const event = await ctx.db.get(eventId);
    if (!event) throw new Error("Event not found");

    const ticket = await ctx.db.get(ticketTypeId);
    if (!ticket) throw new Error("Ticket type not found");

    // Count total purchased tickets
    const purchasedOffers = await ctx.db
      .query("tickets")
      .withIndex("by_event_ticket_id", (q) =>
        q.eq("eventId", eventId).eq("ticketTypeId", ticketTypeId)
      )
      .collect()
      .then((tickets) =>
        tickets.filter(
          (t) =>
            t.status === TICKET_STATUS.VALID || t.status === TICKET_STATUS.USED
        )
      );

    console.log("purchasedOffers", purchasedOffers);
    console.log("Purchased Offers:", purchasedOffers);
    console.log(
      "Purchased Count Calculation:",
      purchasedOffers.map((o) => o.count)
    );

    const purchasedCount = purchasedOffers.reduce(
      (acc, offer) => acc + (offer.count || 0), // Ensure count is added correctly
      0 // Start from 0
    );

    // Count current valid offers
    const now = Date.now();
    const activeOffers = await ctx.db
      .query("waitingList")
      .withIndex("by_event_ticket_type_status", (q) =>
        q
          .eq("eventId", eventId)
          .eq("ticketTypeId", ticketTypeId)
          .eq("status", WAITING_LIST_STATUS.OFFERED)
      )
      .collect()
      .then((entries) => entries.filter((e) => (e.offerExpiresAt ?? 0) > now));

    const activeOffersLength = activeOffers.reduce(
      (acc, cur) => acc + cur.count,
      0
    );

    const totalReserved = purchasedCount + activeOffersLength;

    if (!event) {
      throw new Error("Event not found");
    }

    if (!ticket.totalTickets) {
      throw new Error("Event totalTickets is undefined");
    }

    return {
      isSoldOut: totalReserved >= ticket.totalTickets,
      totalTickets: ticket.totalTickets,
      purchasedCount,
      activeOffers,
      remainingTickets: Math.max(0, ticket.totalTickets - totalReserved),
    };
  },
});

export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, { searchTerm }) => {
    const events = await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("is_cancelled"), undefined))
      .collect();

    return events.filter((event) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        event.name.toLowerCase().includes(searchTermLower) ||
        event.description.toLowerCase().includes(searchTermLower) ||
        event.location.toLowerCase().includes(searchTermLower)
      );
    });
  },
});

export const getByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("events")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("is_cancelled"), undefined))
      .collect();
  },
});

export const getSellerEvents = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const events = await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    // For each event, get ticket sales data
    const eventsWithMetrics = await Promise.all(
      events.map(async (event) => {
        const tickets = await ctx.db
          .query("tickets")
          .withIndex("by_event", (q) => q.eq("eventId", event._id))
          .collect();

        const validTickets = tickets.filter(
          (t) => t.status === "valid" || t.status === "used"
        );
        const refundedTickets = tickets.filter((t) => t.status === "refunded");
        const cancelledTickets = tickets.filter(
          (t) => t.status === "cancelled"
        );
        // add all the amount in each ticket
        const totalRevenue = validTickets.reduce(
          (sum, ticket) => sum + (ticket.amount ?? 0),
          0
        );

        // the revenue calculation is a placeholder and should be replaced with the actual formula
        // const totalRevenue =

        const metrics: Metrics = {
          soldTickets: validTickets.length,
          refundedTickets: refundedTickets.length,
          cancelledTickets: cancelledTickets.length,
          revenue: totalRevenue,
          // revenue: 0, // this is just a test case.
        };

        return {
          ...event,
          metrics,
        };
      })
    );

    return eventsWithMetrics;
  },
});

export const updateEvent = mutation({
  args: {
    eventId: v.id("events"),
    name: v.string(),
    description: v.string(),
    location: v.string(),
    eventDate: v.number(),
    ticketTypes: v.array(
      v.object({
        id: v.optional(v.id("ticketTypes")),
        name: v.string(),
        price: v.number(),
        totalTickets: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { eventId, ...updates } = args;

    // Get current event to check tickets sold
    const event = await ctx.db.get(eventId);
    if (!event) throw new Error("Event not found");

    const soldTickets = await ctx.db
      .query("tickets")
      .withIndex("by_event", (q) => q.eq("eventId", eventId))
      .filter((q) =>
        q.or(q.eq(q.field("status"), "valid"), q.eq(q.field("status"), "used"))
      )
      .collect();

    // Group sold tickets by ticket type
    const soldByTicketType = await Promise.all(
      soldTickets.map(async (ticket) => {
        const ticketType = await ctx.db.get(ticket.ticketTypeId);
        return { ticket, typeName: ticketType?.name };
      })
    ).then((tickets) =>
      tickets.reduce((acc: { [key: string]: number }, { ticket, typeName }) => {
        if (typeName) {
          acc[typeName] = (acc[typeName] || 0) + ticket.count;
        }
        return acc;
      }, {})
    );

    // Validate that new ticket type configurations don't reduce capacity below sold tickets
    for (const ticketType of updates.ticketTypes) {
      const soldCount = soldByTicketType[ticketType.name] || 0;
      if (ticketType.totalTickets < soldCount) {
        throw new Error(
          `Cannot reduce "${ticketType.name}" tickets below ${soldCount} (number of tickets already sold)`
        );
      }
    }

    // First update the event details without ticket types
    const { ticketTypes, ...eventUpdates } = updates;
    await ctx.db.patch(eventId, eventUpdates);

    // Get existing ticket types
    const existingTicketTypes = await ctx.db
      .query("ticketTypes")
      .withIndex("by_event", (q) => q.eq("eventId", eventId))
      .collect();
    // Update existing ticket types and track which ones we've handled
    const handledTicketTypeIds = new Set<string>();

    for (const ticketType of ticketTypes) {
      if (ticketType.id) {
        // Update existing ticket type
        await ctx.db.patch(ticketType.id, {
          price: ticketType.price,
          totalTickets: ticketType.totalTickets,
        });
        handledTicketTypeIds.add(ticketType.id);
      } else {
        // Create new ticket type if no ID exists
        await ctx.db.insert("ticketTypes", {
          eventId,
          name: ticketType.name,
          price: ticketType.price,
          totalTickets: ticketType.totalTickets,
        });
      }
    }

    // Delete only the ticket types that weren't updated (they were removed in the form)
    for (const existingType of existingTicketTypes) {
      if (!handledTicketTypeIds.has(existingType._id)) {
        await ctx.db.delete(existingType._id);
      }
    }

    return eventId;
  },
});

export const cancelEvent = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    const event = await ctx.db.get(eventId);
    if (!event) throw new Error("Event not found");

    // Get all valid tickets for this event
    const tickets = await ctx.db
      .query("tickets")
      .withIndex("by_event", (q) => q.eq("eventId", eventId))
      .filter((q) =>
        q.or(q.eq(q.field("status"), "valid"), q.eq(q.field("status"), "used"))
      )
      .collect();

    if (tickets.length > 0) {
      throw new Error(
        "Cannot cancel event with active tickets. Please refund all tickets first."
      );
    }

    // Mark event as cancelled
    await ctx.db.patch(eventId, {
      is_cancelled: true,
    });

    // Delete any waiting list entries
    const waitingListEntries = await ctx.db
      .query("waitingList")
      .withIndex("by_event_status", (q) => q.eq("eventId", eventId))
      .collect();

    for (const entry of waitingListEntries) {
      await ctx.db.delete(entry._id);
    }

    return { success: true };
  },
});
