"use client";

import EventForm from "@/components/EventForm";
import { useQuery } from "convex/react";
import { AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";

export default function EditEventPage() {
  const params = useParams();
  const event = useQuery(api.events.getById, {
    eventId: params.id as Id<"events">,
  });

  if (!event) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="border bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#00c9aa] to-[#00a184] px-6 py-8 text-gray-950">
          <h2 className="text-2xl font-bold">Edit Event</h2>
          <p className="text-gray-600 mt-2">Update your event details</p>
        </div>

        <div className="p-6">
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex gap-2 text-amber-800">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">
                Note: If you modify the total number of tickets, any tickets
                already sold will remain valid. You can only increase the total
                number of tickets, not decrease it below the number of tickets
                already sold.
              </p>
            </div>
          </div>

          <EventForm mode="edit" initialData={event} />
        </div>
      </div>
    </div>
  );
}
