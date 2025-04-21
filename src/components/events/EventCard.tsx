"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  Check,
  CircleArrowRight,
  LoaderCircle,
  MapPin,
  PencilIcon,
  StarIcon,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import PurchaseTicket from "@/components//tickets/PurchaseTicket";
import EventCardSkeleton from "@/components/events/EventCardSkeleton";
import { Card } from "@/components/ui/card";
import FormatMoney, { cn, useStorageUrl } from "@/lib/utils";
import { useCallback, useMemo } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export default function EventCard({
  eventId,
  motionkey,
}: {
  eventId: Id<"events"> | null;
  motionkey: number;
}) {
  const { user } = useUser();
  const router = useRouter();

  // Early return for null eventId
  if (!eventId) return null;

  const event = useQuery(api.events.getById, { eventId });
  const ticketTypesQuery = useQuery(api.tickets.getTicketTypes, {
    eventId: eventId,
  });
  const userTicket = useQuery(api.tickets.getUserTicketForEvent, {
    eventId,
    userId: user?.id ?? "",
  });
  const queuePosition = useQuery(
    api.waitingList.getQueuePositions,
    user?.id ? { eventId, userId: user.id } : { eventId, userId: "" }
  );
  const imageUrl = useStorageUrl(event?.imageStorageId);

  // Memoize expensive calculations
  const {
    minTicketPrice,
    maxTicketPrice,
    isSingleTicketType,
    isPastEvent,
    isEventOwner,
  } = useMemo(() => {
    if (!event || !ticketTypesQuery)
      return {
        minTicketPrice: 0,
        maxTicketPrice: 0,
        isSingleTicketType: false,
        isPastEvent: false,
        isEventOwner: false,
      };

    return {
      minTicketPrice: Math.min(
        ...ticketTypesQuery.map((ticketType) => ticketType.price)
      ),
      maxTicketPrice: Math.max(
        ...ticketTypesQuery.map((ticketType) => ticketType.price)
      ),
      isSingleTicketType: ticketTypesQuery.length === 1,
      isPastEvent: event.eventDate < Date.now(),
      isEventOwner: user?.id === event?.userId,
    };
  }, [event, ticketTypesQuery, user?.id]);
  // Memoize callbacks
  const handleCardClick = useCallback(() => {
    router.push(`/event/${eventId}`);
  }, [router, eventId]);

  const handleEditClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      router.push(`/seller/events/${eventId}/edit`);
    },
    [router, eventId]
  );

  const handleTicketClick = useCallback(() => {
    if (userTicket) {
      router.push(`/tickets/${userTicket._id}`);
    }
  }, [router, userTicket]);

  if (!event) {
    return <EventCardSkeleton />;
    // return null;
  }

  const renderQueuePosition = () => {
    if (!queuePosition || queuePosition.status !== "waiting") return null;

    // if (availability.purchasedCount >= availability.totalTickets) {
    //   return (
    //     <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
    //       <div className="flex items-center">
    //         <Ticket className="w-5 h-5 text-gray-400 mr-2" />
    //         <span className="text-gray-600">Event is sold out</span>
    //       </div>
    //     </div>
    //   );
    // }

    if (queuePosition.position === 2) {
      return (
        <div className="flex flex-col items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
          <div className="flex items-center">
            <CircleArrowRight className="w-5 h-5 hidden md:block  text-amber-500 mr-1" />
            <span className="text-amber-700 font-medium">
              You&apos;re next in line!{" "}
              <span className="text-amber-500 text-sm">
                {" "}
                (Queue position: {queuePosition.position})
              </span>
            </span>
          </div>
          <div className="flex items-center">
            <LoaderCircle className="w-4 h-4 mr-1 animate-spin text-amber-500" />
            <span className="text-amber-600 text-sm">Waiting for ticket</span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-center">
          <LoaderCircle className="w-4 h-4 mr-2 animate-spin text-green-500" />
          <span className="text-green-700">Queue position</span>
        </div>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
          #{queuePosition.position}
        </span>
      </div>
    );
  };

  const renderTicketStatus = () => {
    if (!user) return null;

    if (isEventOwner) {
      return (
        <div className="mt-4">
          <button
            onClick={handleEditClick}
            className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 shadow-sm flex items-center justify-center gap-2"
          >
            <PencilIcon className="w-5 h-5" />
            Edit Event
          </button>
        </div>
      );
    }

    if (userTicket) {
      return (
        <div className="mt-4 flex items-center justify-between p-3 bg-jmprimary/10 rounded-lg border border-jmprimary/5">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-jmprimary mr-2" />
            <span className="text-jmprimary font-medium">
              You have a ticket!
            </span>
          </div>
          <button
            onClick={handleTicketClick}
            className="text-sm bg-jmprimary/50 hover:bg-jmprimary/70 text-black px-3 py-1.5 rounded-full font-medium shadow-sm transition-colors duration-200 flex items-center gap-1"
          >
            View your ticket
          </button>
        </div>
      );
    }

    if (queuePosition) {
      return (
        <div className="mt-4">
          {queuePosition.status === "offered" && (
            <PurchaseTicket
              eventId={eventId}
              ticketTypeId={queuePosition.ticketTypeId}
            />
          )}
          {renderQueuePosition()}
          {queuePosition.status === "expired" && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-100">
              <span className="text-red-700 font-medium flex items-center">
                <XCircle className="w-5 h-5 mr-2" />
                Offer expired
              </span>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <Card
      className={cn(
        "relative bg-card text-card-foreground shadow rounded-xl hover:shadow-lg hover:border-primary/30 transition-all duration-300 border overflow-hidden  border-primary-foreground cursor-pointer max-w-xl"
      )}
    >
      <motion.div
        onClick={handleCardClick}
        className={`relative ${
          isPastEvent ? "opacity-75 hover:opacity-100" : ""
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: motionkey * 0.2, // Delay depends on the index
          duration: 0.5, // Duration of the animation
        }}
      >
        {/* 'PAST' Ribbon */}
        {isPastEvent && (
          <>
            <div className="absolute top-4 right-2 bg-jmprimary text-white text-xs font-extrabold uppercase py-1 px-10 transform rotate-45 translate-x-10 -translate-y-1 z-20">
              PAST
            </div>
            {/* <div className="absolute h-10 w-10 z-10 bg-jmaccent right-4 top-2 transform translate-x-1/2 " /> */}
          </>
        )}

        {/* Event Image */}
        {imageUrl && (
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={imageUrl}
              alt={event.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

            {/* Event Owner Ribbon */}
            <div className="absolute bottom-[2px] left-[3px]">
              {isEventOwner && (
                <span className="inline-flex items-center gap-1 border border-jmprimary/10 bg-black/40 backdrop-blur-sm text-jmprimary px-2 py-1 rounded-md text-xs font-semibold">
                  <StarIcon className="w-3 h-3" />
                  Your Event
                </span>
              )}
            </div>
          </div>
        )}

        <div className={`p-6 ${imageUrl ? "relative" : ""}`}>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-card-foreground font-extrabold">
                KES{" "}
                <span className="text-xl">{FormatMoney(minTicketPrice)}</span>{" "}
              </span>
            </div>

            {/* <div className="flex flex-col items-end gap-2 ml-4 shrink-0">
              {availability.purchasedCount >= availability.totalTickets && (
                <span className="px-4 py-1.5 bg-red-50 text-red-700 font-semibold rounded-full text-xs md:text-sm">
                  Sold Out
                </span>
              )}
            </div> */}
          </div>

          <div className="mt-4 flex gap-4">
            <div className="w-20 h-20 rounded-lg flex items-center justify-start flex-col shadow-md shrink-0  overflow-hidden">
              <div className="uppercase bg-card-foreground px-2 py-1 justify-center flex font-bold  w-full text-card">
                {new Intl.DateTimeFormat("en-US", { month: "short" }).format(
                  new Date(event.eventDate)
                )}
              </div>
              <div className="text-card-foreground flex-1 flex items-center justify-center text-3xl font-bold">
                {new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(
                  new Date(event.eventDate)
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{event.location}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-card-foreground line-clamp-2">
                {event.name}
              </h2>
            </div>
          </div>

          {/* <div className="mt-4 space-y-3"> */}
          {/* {isPastEvent && "(Ended)"} */}

          {/* <div className="flex items-center text-card-foreground">
              <Ticket className="w-4 h-4 mr-2" />
              <span className="text-sm md:text-base">
                {availability.totalTickets - availability.purchasedCount} /{" "}
                {availability.totalTickets} available
                {!isPastEvent && availability.activeOffers > 0 && (
                  <span className="text-amber-600 text-sm ml-2">
                    ({availability.activeOffers}{" "}
                    {availability.activeOffers === 1 ? "person" : "people"}{" "}
                    trying to buy)
                  </span>
                )}
              </span>
            </div> */}
          {/* </div> */}

          <div onClick={(e) => e.stopPropagation()} className="">
            {!isPastEvent && renderTicketStatus()}
          </div>
        </div>
      </motion.div>
    </Card>
  );
}
