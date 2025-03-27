"use client";

import EventCard from "@/components/events/EventCard";
import JoinQueue from "@/components/tickets/JoinQueue";
import Spinner from "@/components/loaders/Spinner";
import { Button } from "@/components/ui/button";
import FormatMoney, { cn, useStorageUrl } from "@/lib/utils";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Ticket } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";
import { ticketTypeWithId } from "@/constants/tickets";
import { useState } from "react";

export default function EventPage() {
  const { user } = useUser();
  const params = useParams();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [selectedCount, setSelectedCount] = useState<{ [key: string]: number }>(
    {}
  );

  const event = useQuery(api.events.getById, {
    eventId: params.id as Id<"events">,
  });
  const availability = useQuery(api.events.getEventAvailability, {
    eventId: params.id as Id<"events">,
  });
  const ticketTypesQuery = useQuery(api.tickets.getTicketTypes, {
    eventId: params.id as Id<"events">,
  });

  const imageUrl = useStorageUrl(event?.imageStorageId);

  if (!event || !availability) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const handleTicketChange = (
    ticketType: ticketTypeWithId["_id"],
    change: number
  ) => {
    setSelectedCount((prev) => {
      const newCount = (prev[ticketType] || 0) + change;

      // Prevent negative count
      if (newCount < 0) return prev;

      const updatedCounts = { ...prev };
      if (newCount === 0) {
        delete updatedCounts[ticketType]; // Remove from count if 0
      } else {
        updatedCounts[ticketType] = newCount;
      }

      // If any ticket type is selected, disable others
      const isAnySelected = Object.values(updatedCounts).some(
        (count) => count > 0
      );
      setSelectedTicket(isAnySelected ? ticketType : null);

      return updatedCounts;
    });
  };

  return (
    <div className="h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border border-primary-foreground rounded-xl shadow-sm overflow-hidden">
          {imageUrl && (
            <div className="aspect-[21/9] relative w-full">
              <Image
                src={imageUrl}
                alt={event.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column - Event Details */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-4">
                    {event.name}
                  </h1>
                </div>

                <div className="grid gap-3">
                  {ticketTypesQuery?.map((ticket, index) => (
                    <div
                      key={index}
                      className="text-card-foreground bg-card p-4 rounded-lg border"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Ticket className="w-5 h-5 mr-2 text-[#00a184]" />
                          <span className="md:text-base text-sm font-extrabold text-muted-foreground">
                            {ticket.name}
                          </span>
                        </div>
                        <p className="text-xs justify-end md:text-base">
                          Ksh{" "}
                          <span className="font-extrabold">
                            {FormatMoney(Number(ticket.price))}
                          </span>
                        </p>

                        {/* Ticket Buttons */}
                        <div>
                          {availability.purchasedCount >=
                          availability.totalTickets ? (
                            <span className="px-4 py-1.5 bg-red-50 text-red-700 font-semibold rounded-full text-xs md:text-sm">
                              Sold Out
                            </span>
                          ) : (
                            <>
                              {/* add and remove tickets button  */}
                              <div className="flex gap-3  md:gap-4 items-center">
                                <Button
                                  className={cn("font-bold ")}
                                  size={"sm"}
                                  onClick={() =>
                                    handleTicketChange(ticket._id, -1)
                                  }
                                  disabled={selectedCount[ticket._id] <= 0}
                                >
                                  -
                                </Button>
                                <span>{selectedCount[ticket._id] || 0}</span>
                                <Button
                                  className={cn("font-bold")}
                                  size={"sm"}
                                  onClick={() =>
                                    handleTicketChange(ticket._id, 1)
                                  }
                                  disabled={Boolean(
                                    selectedTicket &&
                                      selectedTicket !== ticket._id
                                  )} // Disable other types if one is selected
                                >
                                  +
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* <div className="text-card-foreground bg-card p-4 rounded-lg border">
                    <div className="flex items-center mb-1">
                      <Users className="w-5 h-5 mr-2 text-[#00a184]" />
                      <span className="text-sm text-muted-foreground font-medium">
                        Availability
                      </span>
                    </div>
                    <p className="text-sm md:text-base">
                      {availability.totalTickets - availability.purchasedCount}{" "}
                      / {availability.totalTickets} left
                    </p>
                  </div> */}
                </div>

                {/* Additional Event Information */}
                <div className="text-card-foreground bg-card border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#00a184] mb-2">
                    Event Description
                  </h3>
                  <p className="space-y-2 text-[#00a184] text-sm md:text-base">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Right Column - Ticket Purchase Card */}
              <div>
                <div className="sticky top-8 space-y-4">
                  <EventCard
                    motionkey={1}
                    eventId={params.id as Id<"events">}
                  />
                  {/* ticket should take the tickettypeId and price  */}
                  {user ? (
                    <JoinQueue
                      eventId={params.id as Id<"events">}
                      userId={user.id}
                    />
                  ) : (
                    <SignInButton mode="modal">
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                        Sign in to buy tickets
                      </Button>
                    </SignInButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
