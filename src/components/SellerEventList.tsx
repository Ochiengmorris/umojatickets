"use client";

import { useStorageUrl } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import {
  Ban,
  Banknote,
  CalendarDays,
  Edit,
  InfoIcon,
  Ticket,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { Metrics } from "../../convex/events";
import CancelEventButton from "./CancelEventButton";
import Spinner from "./Spinner";
export default function SellerEventList() {
  const { user } = useUser();
  const events = useQuery(api.events.getSellerEvents, {
    userId: user?.id ?? "",
  });

  if (!events) return <Spinner />;

  const upcomingEvents = events.filter((e) => e.eventDate > Date.now());
  const pastEvents = events.filter((e) => e.eventDate <= Date.now());

  return (
    <div className="mx-auto space-y-8">
      {/* Upcoming Events */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
        <div className="grid grid-cols-1 gap-6">
          {upcomingEvents.map((event) => (
            <SellerEventCard key={event._id} event={event} />
          ))}
          {upcomingEvents.length === 0 && (
            <p className="text-gray-500">You have No upcoming events</p>
          )}
        </div>
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Past Events</h2>
          <div className="grid grid-cols-1 gap-6">
            {pastEvents.map((event) => (
              <SellerEventCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SellerEventCard({
  event,
}: {
  event: Doc<"events"> & {
    metrics: Metrics;
  };
}) {
  const imageUrl = useStorageUrl(event.imageStorageId);
  const isPastEvent = event.eventDate < Date.now();

  return (
    <div
      className={`border bg-card text-card-foreground rounded-lg shadow-sm  ${event.is_cancelled ? "border-red-500/50" : ""} overflow-hidden`}
    >
      <div className="p-6 ">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Event Image */}
          {imageUrl && (
            <div className="relative w-full md:w-40 h-64 md:h-40 rounded-lg overflow-hidden shrink-0">
              <Image
                src={imageUrl}
                alt={event.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Event Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <h3 className="text-xl md:truncate font-semibold ">
                    {event.name}
                  </h3>

                  {/* Seen only on large Screens */}
                  <div className="hidden lg:flex shrink-0 ml-auto items-center gap-2">
                    {!isPastEvent && !event.is_cancelled && (
                      <>
                        <Link
                          href={`/seller/events/${event._id}/edit`}
                          className="shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Link>
                        <CancelEventButton eventId={event._id} />
                      </>
                    )}
                  </div>
                </div>
                <p className="mt-1 text-muted-foreground line-clamp-2 lg:line-clamp-1">
                  {event.description}
                </p>
                {event.is_cancelled && (
                  <div className="mt-2 flex items-center gap-2 text-red-600">
                    <Ban className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Event Cancelled & Refunded
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border p-3 rounded-lg">
                <div className="flex items-center gap-2  mb-1 text-primary/70">
                  <Ticket className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {event.is_cancelled ? "Tickets Refunded" : "Tickets Sold"}
                  </span>
                </div>
                <p className="text-2xl font-semibold ">
                  {event.is_cancelled ? (
                    <>
                      {event.metrics.refundedTickets}
                      <span className="text-sm font-normal"> refunded</span>
                    </>
                  ) : (
                    <>
                      {event.metrics.soldTickets}
                      <span className="text-sm  font-normal">
                        /{event.totalTickets}
                      </span>
                    </>
                  )}
                </p>
              </div>

              <div className="border p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1 text-primary/70">
                  <Banknote className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {event.is_cancelled ? "Amount Refunded" : "Revenue"}
                  </span>
                </div>
                <p className="text-2xl font-semibold ">
                  <span className="text-sm font-normal">Ksh </span>
                  {event.is_cancelled
                    ? event.metrics.refundedTickets * event.price
                    : event.metrics.revenue}
                </p>
              </div>

              <div className="border p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1 text-primary/70">
                  <CalendarDays className="w-4 h-4" />
                  <span className="text-sm font-medium ">Date</span>
                </div>
                <p className="text-sm font-medium">
                  {new Date(event.eventDate).toLocaleDateString()}
                </p>
              </div>

              <div className="border p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1 text-primary/70">
                  <InfoIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <p className="text-sm font-medium">
                  {event.is_cancelled
                    ? "Cancelled"
                    : isPastEvent
                      ? "Ended"
                      : "Active"}
                </p>
              </div>
            </div>

            {/* Action buttons on Mobile medium Screens */}
            <div className="hidden mt-4 md:flex lg:hidden justify-end w-full  items-center gap-2">
              {!isPastEvent && !event.is_cancelled && (
                <>
                  <Link
                    href={`/seller/events/${event._id}/edit`}
                    className="shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                  <CancelEventButton eventId={event._id} />
                </>
              )}
            </div>
          </div>

          {/* Action buttons on Mobile small Screens */}
          <div className="flex md:hidden items-center w-full justify-end gap-2">
            {!isPastEvent && !event.is_cancelled && (
              <>
                <Link
                  href={`/seller/events/${event._id}/edit`}
                  className="shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
                <CancelEventButton eventId={event._id} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
