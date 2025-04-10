"use client";

import EventCard from "@/components/events/EventCard";
import Spinner from "@/components/loaders/Spinner";
import JoinQueue from "@/components/tickets/JoinQueue";
import { Button } from "@/components/ui/button";
import { ticketTypeWithId } from "@/constants/tickets";
import FormatMoney, { cn, useStorageUrl } from "@/lib/utils";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Ticket } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

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

  const userTicket = useQuery(api.tickets.getUserTicketForEvent, {
    eventId: params.id as Id<"events">,
    userId: user?.id ?? "",
  });

  const allAvailability = useQuery(api.events.getAllAvailabilityForEvent, {
    eventId: params.id as Id<"events">,
  });

  // console.log("allAvailability", allAvailability);

  const availabilityForSelected = allAvailability?.find(
    (a) => a.ticketType._id === selectedTicket
  )?.remainingTickets;

  const hasBeenOffered = useQuery(api.waitingList.hasBeenOffered, {
    eventId: params.id as Id<"events">,
    userId: user?.id ?? "",
  });
  const ticketTypesQuery = useQuery(api.tickets.getTicketTypes, {
    eventId: params.id as Id<"events">,
  });
  // TODO: modify the check for availability of a ticket type to only check if its available on the waiting list... if not then the availability will be zero instead of only one. one should be allowed only when the last buyer is still in the waitiling list with a offered ticket type

  const imageUrl = useStorageUrl(event?.imageStorageId);

  const isEventPast = event?.eventDate ? event.eventDate < Date.now() : false;

  if (!event || !allAvailability) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner />
          <p className="text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    );
  }

  const isEventOwner = user?.id === event?.userId;

  const handleTicketChange = (
    ticketType: ticketTypeWithId["_id"],
    change: number
  ) => {
    setSelectedCount((prev) => {
      const newCount = (prev[ticketType] || 0) + change;

      // Prevent negative count
      if (newCount < 0) return prev;

      // Check if we're trying to add more tickets than available
      if (
        change > 0 &&
        availabilityForSelected !== undefined &&
        newCount > availabilityForSelected
      ) {
        return prev;
      }

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

  const totalPrice =
    selectedTicket && ticketTypesQuery
      ? selectedCount[selectedTicket] *
        (ticketTypesQuery.find((t) => t._id === selectedTicket)?.price ?? 0)
      : 0;

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
              <div className="space-y-6 md:space-y-8">
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-4">
                    {event.name}
                  </h1>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Select your preferred ticket type below
                  </p>
                </div>

                <div className="grid gap-3">
                  {ticketTypesQuery?.map((ticket, index) => (
                    <div
                      key={index}
                      className={cn(
                        "text-card-foreground bg-card p-4 rounded-xl border transition-all duration-200 ease-in-out",
                        selectedTicket === ticket._id
                          ? "border-primary/30 shadow-md"
                          : "border-border hover:border-primary/20"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex flex-1 items-center">
                          <Ticket className="w-5 h-5 mr-2 text-jmprimary" />
                          <span className="md:text-base text-sm font-extrabold text-muted-foreground">
                            {ticket.name}
                          </span>
                        </div>
                        <p className="text-xs justify-end flex flex-1 md:text-base gap-1">
                          Ksh
                          <span className="font-extrabold mr-[50%]">
                            {FormatMoney(Number(ticket.price))}
                          </span>
                        </p>

                        {/* Ticket Buttons */}
                        <div className="flex-1 justify-end flex">
                          {/* {availability.purchasedCount >=
                          availability.totalTickets ? (
                            <span className="px-4 py-1.5 bg-red-50 text-red-700 font-semibold rounded-full text-xs md:text-sm">
                              Sold Out
                            </span>
                          ) : ( */}
                          <>
                            {/* add and remove tickets button  */}
                            <div className="flex gap-3 md:gap-4 items-center">
                              <Button
                                className={cn("font-bold ")}
                                size={"sm"}
                                onClick={() =>
                                  handleTicketChange(ticket._id, -1)
                                }
                                disabled={
                                  selectedCount[ticket._id] <= 0 ||
                                  Boolean(
                                    selectedTicket &&
                                      selectedTicket !== ticket._id
                                  ) ||
                                  hasBeenOffered ||
                                  isEventPast ||
                                  isEventOwner ||
                                  userTicket !== null
                                }
                              >
                                -
                              </Button>
                              <span className="">
                                {selectedCount[ticket._id] || 0}
                              </span>
                              <Button
                                className={cn("font-bold")}
                                size={"sm"}
                                onClick={() =>
                                  handleTicketChange(ticket._id, 1)
                                }
                                disabled={
                                  Boolean(
                                    selectedTicket &&
                                      selectedTicket !== ticket._id
                                  ) ||
                                  hasBeenOffered ||
                                  isEventPast ||
                                  isEventOwner ||
                                  userTicket !== null
                                } // Disable other types if one is selected
                              >
                                +
                              </Button>
                            </div>
                          </>
                          {/* )} */}
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
                  <h3 className="text-lg font-semibold text-jmprimary mb-2">
                    Event Description
                  </h3>
                  <p className="space-y-2 text-muted-foreground text-sm md:text-base">
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
                    isEventPast ? (
                      <div className="p-4 bg-destructive/10 text-center text-destructive w-full font-semibold rounded-lg transition-all max-w-xl cursor-not-allowed  duration-200 px-4 py-3">
                        This event has ended
                      </div>
                    ) : isEventOwner ? (
                      <div
                        className={cn(
                          "w-full bg-primary/5 text-muted-foreground/50 font-semibold rounded-lg transition-all max-w-xl cursor-not-allowed text-center duration-200 px-4 py-3"
                        )}
                      >
                        You are the owner of this event
                      </div>
                    ) : hasBeenOffered ? (
                      <></>
                    ) : userTicket ? (
                      <div className="w-full bg-primary/5 text-muted-foreground/50 font-semibold rounded-lg transition-all max-w-xl cursor-not-allowed text-center duration-200 px-4 py-3">
                        You have already purchased a ticket for this event
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-end gap-2">
                          Total Price:{" "}
                          <span className="font-bold">
                            {FormatMoney(totalPrice)}
                          </span>
                        </div>

                        {selectedTicket !== null && selectedTicket !== "" ? (
                          <JoinQueue
                            eventId={params.id as Id<"events">}
                            userId={user.id}
                            ticketTypeId={selectedTicket as Id<"ticketTypes">}
                            selectedCount={selectedCount[selectedTicket]}
                          />
                        ) : (
                          <div
                            className={cn(
                              "w-full bg-primary/5 text-muted-foreground/50 font-semibold rounded-lg transition-all max-w-xl cursor-not-allowed text-center duration-200 px-4 py-3"
                            )}
                          >
                            No Ticket Selected
                          </div>
                        )}
                      </>
                    )
                  ) : (
                    <SignInButton mode="modal">
                      <Button className="w-full bg-primary text-primary-foreground font-semibold rounded-lg transition-all max-w-xl text-center duration-200 px-4 py-3">
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
