"use client";

import { useStorageUrl } from "@/lib/utils";
import { useQuery } from "convex/react";
import {
  CalendarDays,
  IdCard,
  MapPin,
  Ticket as TicketIcon,
  User,
} from "lucide-react";
import Image from "next/image";
import QRCode from "react-qr-code";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import Spinner from "./Spinner";

export default function Ticket({ ticketId }: { ticketId: Id<"tickets"> }) {
  const ticket = useQuery(api.tickets.getTicketWithDetails, { ticketId });
  const user = useQuery(api.users.getUserById, {
    userId: ticket?.userId ?? "",
  });
  const imageUrl = useStorageUrl(ticket?.event?.imageStorageId);

  if (!ticket || !ticket.event || !user) {
    return <Spinner />;
  }

  return (
    <div
      className={`border bg-card text-card-foreground rounded-xl overflow-hidden shadow-xl ${ticket.event.is_cancelled ? "border-red-800/50" : ""}`}
    >
      {/* Event Header with Image */}
      <div className="relative">
        {imageUrl && (
          <div className="relative w-full aspect-[21/15] md:aspect-[21/10] ">
            <Image
              src={imageUrl}
              alt={ticket.event.name}
              fill
              className={`object-cover object-center ${ticket.event.is_cancelled ? "opacity-50" : ""}`}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/90" />
          </div>
        )}
        <div
          className={`px-6 py-4 ${imageUrl ? "absolute bottom-0 left-0 right-0" : ticket.event.is_cancelled ? "bg-red-600/50" : "bg-[#00c9aa]"} `}
        >
          <h2
            className={`text-xl md:text-2xl font-bold ${imageUrl || !imageUrl ? "text-black" : "text-black"}`}
          >
            {ticket.event.name}
          </h2>
          {ticket.event.is_cancelled && (
            <p className="text-red-600 mt-1 text-sm md:text-base">
              This event has been cancelled
            </p>
          )}
        </div>
      </div>

      {/* Ticket Content */}
      <div className="p-6 border-b">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Event Details */}
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <CalendarDays
                className={`w-5 h-5 mr-3 ${ticket.event.is_cancelled ? "text-red-800/50" : "text-[#00c9aa]"}`}
              />
              <div>
                <p className="text-sm text-muted-foreground/80">Date</p>
                <p className="font-medium text-primary/80">
                  {new Date(ticket.event.eventDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <MapPin
                className={`w-5 h-5 mr-3 ${ticket.event.is_cancelled ? "text-red-800/50" : "text-[#00c9aa]"}`}
              />
              <div>
                <p className="text-sm text-muted-foreground/80">Location</p>
                <p className="font-medium text-primary/80">
                  {ticket.event.location}
                </p>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <User
                className={`w-5 h-5 mr-3 ${ticket.event.is_cancelled ? "text-red-800/50" : "text-[#00c9aa]"}`}
              />
              <div>
                <p className="text-sm text-muted-foreground/80">
                  Ticket Holder
                </p>
                <p className="font-medium text-primary/80">{user.name}</p>
                {/* <p className="text-sm">{user.email}</p> */}
              </div>
            </div>

            <div className="flex items-center text-gray-600 break-all">
              <IdCard
                className={`w-5 h-5 mr-3 ${ticket.event.is_cancelled ? "text-red-800/50" : "text-[#00c9aa]"}`}
              />
              <div>
                <p className="text-sm text-muted-foreground/80">
                  Ticket Holder Email
                </p>
                <p className="font-medium text-primary/80">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <TicketIcon
                className={`w-5 h-5 mr-3 ${ticket.event.is_cancelled ? "text-red-800/50" : "text-[#00c9aa]"}`}
              />
              <div>
                <p className="text-sm text-muted-foreground/80">Ticket Price</p>
                <p className="font-medium text-primary/80">
                  <span className="text-sm">Ksh</span>{" "}
                  {ticket.event.price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - QR Code */}
          <div className="flex flex-col items-center justify-center md:border-l pl-6">
            <div
              className={`bg-gray-100 p-4 rounded-lg ${ticket.event.is_cancelled ? "opacity-50" : ""}`}
            >
              <QRCode value={ticket._id} className="w-32 h-32" />
            </div>
            <p className="mt-2 text-sm text-gray-500 break-all text-center max-w-[200px] md:max-w-full">
              Ticket ID: {ticket._id}
            </p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 pt-6 border-t ">
          <h3 className="text-sm font-medium text-foreground/70 mb-2">
            Important Information
          </h3>
          {ticket.event.is_cancelled ? (
            <p className="text-sm text-red-600">
              This event has been cancelled. A refund will be processed if it
              hasn&apos;t been already.
            </p>
          ) : (
            <ul className="text-sm text-foreground/70 space-y-1">
              <li>• Please arrive at least 30 minutes before the event</li>
              <li>• Have your ticket QR code ready for scanning</li>
              <li>• This ticket is non-transferable</li>
            </ul>
          )}
        </div>
      </div>

      {/* Ticket Footer */}
      <div
        className={`${ticket.event.is_cancelled ? "" : ""} px-6 py-4 flex justify-between items-center`}
      >
        <span className="text-sm text-foreground/70">
          Purchase Date: {new Date(ticket.purchasedAt).toLocaleString()}
        </span>
        <span
          className={`text-sm font-medium ${ticket.event.is_cancelled ? "text-red-600" : "text-[#00c9aa]"}`}
        >
          {ticket.event.is_cancelled ? "Cancelled" : "Valid Ticket"}
        </span>
      </div>
    </div>
  );
}
