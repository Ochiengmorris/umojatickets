"use client";

import { refundEventTickets } from "@/actions/refundEventTickets";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "convex/react";
import { Ban } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default function CancelEventButton({
  eventId,
}: {
  eventId: Id<"events">;
}) {
  const [isCancelling, setIsCancelling] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const cancelEvent = useMutation(api.events.cancelEvent);

  const handleCancel = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel this event? All tickets will be refunded and the event will be cancelled permanently."
      )
    ) {
      return;
    }

    setIsCancelling(true);
    try {
      await refundEventTickets(eventId);
      await cancelEvent({ eventId });
      toast({
        title: "Event cancelled",
        description: "All tickets have been refunded successfully.",
      });
      router.push("/seller/events");
    } catch (error) {
      console.error("Failed to cancel event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel event. Please try again.",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isCancelling}
      className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors "
    >
      <Ban className="w-4 h-4" />
      <span className="text-sm">
        {isCancelling ? "Processing..." : "Cancel Event"}
      </span>
    </button>
  );
}
