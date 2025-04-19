"use client";
import React from "react";
import { Id } from "../../../convex/_generated/dataModel";

export interface availabilityProps {
  activeOffers: {
    _id: Id<"waitingList">;
    eventId: Id<"events">;
    userId: string;
    count: number;
    ticketTypeId: Id<"ticketTypes">;
    offerExpiresAt?: number | undefined;
    status: "waiting" | "offered" | "purchased" | "expired";
  }[];
  isSoldOut: boolean;
  purchasedCount: number;
  remainingTickets: number;
  totalTickets: number;
  ticketType: {
    name: string;
    price: number;
    _id: Id<"ticketTypes">;
    totalTickets: number;
    eventId: Id<"events">;
  };
}

interface TicketSelectProps {
  ticketTypes: availabilityProps[];
  onSelect: (ticketType: availabilityProps) => void;
}

const TicketSelect = () => {
  return <div>TicketSelect</div>;
};

export default TicketSelect;
