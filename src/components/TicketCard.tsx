"use client";

import { useQuery } from "convex/react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Clock,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import Spinner from "./Spinner";

export default function TicketCard({ ticketId }: { ticketId: Id<"tickets"> }) {
  const ticket = useQuery(api.tickets.getTicketWithDetails, { ticketId });

  if (!ticket || !ticket.event)
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner />
      </div>
    );

  const isPastEvent = ticket.event.eventDate < Date.now();

  const statusColors = {
    valid: isPastEvent
      ? "bg-gray-50 text-gray-600 border-gray-200"
      : "bg-[#e8f3f1] text-[#00a184] border-green-100",
    used: "bg-gray-50 text-gray-600 border-gray-200",
    refunded: "bg-red-50 text-red-700 border-red-100",
    cancelled: "bg-red-50 text-red-700 border-red-100",
  };

  const statusText = {
    valid: isPastEvent ? "Ended" : "Valid",
    used: "Used",
    refunded: "Refunded",
    cancelled: "Cancelled",
  };

  return (
    <Link
      href={`/tickets/${ticketId}`}
      className={`block border bg-card text-card-foreground rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${
        ticket.event.is_cancelled ? "border-red-500/50" : ""
      } overflow-hidden ${isPastEvent ? "opacity-75 hover:opacity-100" : ""}`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{ticket.event.name}</h3>
            <p className="text-sm text-foreground/70 mt-1">
              Purchased on {new Date(ticket.purchasedAt).toLocaleDateString()}
            </p>
            {ticket.event.is_cancelled && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                Event Cancelled
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                ticket.event.is_cancelled
                  ? "bg-red-50 text-red-700 border-red-100"
                  : statusColors[ticket.status]
              }`}
            >
              {ticket.event.is_cancelled
                ? "Cancelled"
                : statusText[ticket.status]}
            </span>
            {isPastEvent && !ticket.event.is_cancelled && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                Past Event
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <CalendarDays
              className={`w-4 h-4 mr-2 ${ticket.event.is_cancelled ? "text-red-600" : "text-[#00c9aa]"}`}
            />
            <span className="text-sm text-foreground/70">
              {new Date(ticket.event.eventDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center">
            <MapPin
              className={`w-4 h-4 mr-2 ${ticket.event.is_cancelled ? "text-red-600" : "text-[#00c9aa]"}`}
            />
            <span className="text-sm text-foreground/70">
              {ticket.event.location}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span
            className={`font-medium ${
              ticket.event.is_cancelled
                ? "text-red-600"
                : isPastEvent
                  ? "text-foreground/70"
                  : "text-[#00a184]"
            }`}
          >
            £{ticket.event.price.toFixed(2)}
          </span>
          <span className="text-foreground/70 flex items-center">
            View Ticket <ArrowRight className="w-4 h-4 ml-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
