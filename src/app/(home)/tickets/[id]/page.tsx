"use client";

import Ticket from "@/components/Ticket";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useEffect } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function TicketPage() {
  const params = useParams();
  const { user } = useUser();
  const ticket = useQuery(api.tickets.getTicketWithDetails, {
    ticketId: params.id as Id<"tickets">,
  });

  useEffect(() => {
    if (!user) {
      redirect("/");
    }

    if (!ticket || ticket.userId !== user.id) {
      redirect("/tickets");
    }

    if (!ticket.event) {
      redirect("/tickets");
    }
  }, [user, ticket]);

  if (!ticket || !ticket.event) {
    return null;
  }

  return (
    <div className="h-full bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 space-y-8">
          {/* Navigation and Actions */}
          <div className="flex items-center justify-between">
            <Link
              href="/tickets"
              className="flex items-center text-foreground hover:text-foreground/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Tickets
            </Link>
            <div className="flex items-center gap-4">
              <button
                // onClick={saveTicketAsPDF}
                className="flex items-center gap-2 px-4 py-2 text-foreground hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">Save</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-foreground hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100">
                <Share2 className="w-4 h-4" />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>

          {/* Event Info Summary */}
          <div
            className={`border bg-card text-card-foreground p-6 rounded-lg shadow-sm ${ticket.event.is_cancelled ? "border-red-800/50" : ""}`}
          >
            <h1 className="text-xl md:text-2xl font-bold">
              {ticket.event.name}
            </h1>
            <p className="mt-1 text-foreground/70 text-sm md:text-base">
              {new Date(ticket.event.eventDate).toLocaleDateString()} at{" "}
              {ticket.event.location}
            </p>
            <div className="mt-4 flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  ticket.event.is_cancelled
                    ? "bg-red-50 text-red-700"
                    : ticket.event.eventDate < Date.now()
                      ? "bg-gray-50 text-gray-700"
                      : "bg-green-50 text-green-700"
                }`}
              >
                {ticket.event.is_cancelled
                  ? "Cancelled"
                  : ticket.event.eventDate < Date.now()
                    ? "Ended"
                    : "Valid Ticket"}
              </span>
              <span className="text-sm text-foreground/70">
                Purchased on {new Date(ticket.purchasedAt).toLocaleDateString()}
              </span>
            </div>
            {ticket.event.is_cancelled && (
              <p className="mt-4 text-sm text-red-600/70">
                This event has been cancelled. A refund will be processed if it
                hasn&apos;t been already.
              </p>
            )}
          </div>
        </div>

        {/* Ticket Component */}
        <div
          id="ticket-container"
          className={`${ticket.event.eventDate < Date.now() ? (ticket.event.is_cancelled ? "" : "grayscale") : ""}`}
        >
          <Ticket ticketId={ticket._id} />
        </div>

        {/* Additional Information */}
        <div
          className={`mt-8 rounded-lg p-4 ${
            ticket.event.is_cancelled ? "  border" : "border"
          }`}
        >
          <h3
            className={`text-sm font-medium ${
              ticket.event.is_cancelled ? "" : ""
            }`}
          >
            Need Help?
          </h3>
          <p
            className={`mt-1 text-sm ${
              ticket.event.is_cancelled
                ? "text-foreground/70"
                : "text-foreground/70"
            }`}
          >
            {ticket.event.is_cancelled
              ? "For questions about refunds or cancellations, please contact our support team at team@umojatickets.com"
              : "If you have any issues with your ticket, please contact our support team at team@umojatickets.com"}
          </p>
        </div>
      </div>
    </div>
  );
}
