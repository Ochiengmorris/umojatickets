"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  Check,
  CircleArrowRight,
  CircleDollarSign,
  Clock9,
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
import Link from "next/link";

const FeaturedCard = ({ eventId }: { eventId: Id<"events"> | null }) => {
  const { user } = useUser();
  const router = useRouter();
  // Early return for null eventId
  if (!eventId) return null;

  const event = useQuery(api.events.getById, { eventId });
  const ticketTypesQuery = useQuery(api.tickets.getTicketTypes, {
    eventId: eventId,
  });

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
      isEventOwner: event.userId === user?.id,
    };
  }, [event, ticketTypesQuery, user?.id]);

  if (!event) {
    return (
      <div className="col-span-1">
        <EventCardSkeleton />
      </div>
    );
  }

  return (
    <Card
      className={cn(
        "relative bg-white flex flex-col md:flex-row  text-landingsecondary shadow rounded-xl hover:shadow-sm transition-all duration-300 border overflow-hidden md:h-96 border-primary-foreground/20"
      )}
    >
      {/* Event Image */}
      {imageUrl && (
        <div className="relative md:w-8/12 shrink-0 h-64 md:h-full">
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
          <div className="absolute bottom-[4px] left-[3px]">
            {isEventOwner && (
              <span className="inline-flex items-center gap-1 border border-jmprimary/10 bg-black/40 backdrop-blur-sm text-jmprimary px-2 py-1 rounded-md text-xs font-semibold">
                <StarIcon className="w-3 h-3" />
                Your Event
              </span>
            )}
          </div>
        </div>
      )}

      <div
        className={`lg:p-6 p-4 flex flex-col w-full  ${imageUrl ? "relative" : ""}`}
      >
        <div className="flex justify-between items-start">
          <h2 className="text-xl md:text-2xl font-bold text-landingsecondary line-clamp-2">
            {event.name}
          </h2>
        </div>

        <div className="mt-4 flex gap-4">
          <div className="w-20 h-20 rounded-lg flex items-center justify-start flex-col shadow-md shrink-0  overflow-hidden">
            <div className="uppercase bg-landingsecondary px-2 py-1 justify-center flex font-bold w-full text-white">
              {new Intl.DateTimeFormat("en-US", { month: "short" }).format(
                new Date(event.eventDate)
              )}
            </div>
            <div className="text-landingsecondary flex-1 flex items-center justify-center text-3xl font-bold">
              {new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(
                new Date(event.eventDate)
              )}
            </div>
          </div>
          <div>
            <div className="items-center gap-2 text-landingsecondary/60 flex sm:flex md:hidden lg:flex">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{event.location}</span>
            </div>

            <div className="flex items-center gap-2 text-landingsecondary">
              <CircleDollarSign className="w-4 h-4" />
              <span className="text-xs text-landingsecondary font-extrabold">
                KES{" "}
                <span className="text-2xl">{FormatMoney(minTicketPrice)}</span>{" "}
              </span>
            </div>

            <div className="flex items-center gap-2 text-landingsecondary">
              <Clock9 className="w-4 h-4" />
              <span>{event.startTime ?? "08:00"}</span>
            </div>
          </div>
        </div>
        <div className="items-center gap-2 mt-1  text-landingsecondary/60 md:flex hidden lg:hidden">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{event.location}</span>
        </div>

        <div className="mt-4">
          <span className="xl:line-clamp-5 line-clamp-3 whitespace-pre-wrap text-sm text-landingsecondary/80">
            {event.description}
          </span>
        </div>

        <div className="flex gap-2 mt-4">
          {/** TODO: Reuse this somehwere else*/}
          {/* {isPastEvent && (
                <span className="inline-flex items-center gap-1 border border-red-500/10 bg-red-500/10 backdrop-blur-sm text-red-500 px-2 py-1 rounded-md text-xs font-semibold">
                <XCircle className="w-3 h-3" />
                Past Event
                </span>
                )} */}
          {isPastEvent && (
            <span className="inline-flex items-center gap-1 border border-green-500/10 bg-jmprimary/20 backdrop-blur-sm text-landingtertiary px-2 py-1 rounded-md text-xs font-semibold">
              <Check className="w-3 h-3" />
              Tickets Available
            </span>
          )}
        </div>
        <div className="items-end flex-1 flex justify-between ">
          <Link
            href={`/event/${eventId}`}
            className="inline-flex items-center gap-2 mt-4 p-4 rounded-xl text-sm font-semibold bg-landingsecondary text-white hover:text-card/80 w-full justify-center transition-colors duration-300 ease-in-out"
          >
            <PencilIcon className="w-4 h-4" />
            <span>View Details</span>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default FeaturedCard;
