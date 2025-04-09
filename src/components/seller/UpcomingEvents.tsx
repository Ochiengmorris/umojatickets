"use client";

import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  TicketIcon,
  ChevronRightIcon,
  Badge,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { format } from "date-fns";

interface UpcomingEventsProps {
  events?: Array<any>;
  isLoading?: boolean;
}

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

const UpcomingEvents = ({ events, isLoading = false }: UpcomingEventsProps) => {
  // Only show upcoming events (date is in the future)
  const getUpcomingEvents = () => {
    if (!events) return [];

    const today = new Date();

    return events
      .filter((event) => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3); // Get only the next 3 upcoming events
  };

  const upcomingEvents = getUpcomingEvents();

  // Helper function to get category name
  const getCategoryName = (categoryId: number) => {
    if (!categoryId) return "";

    // This is a mock implementation since we don't have a categories array
    switch (categoryId) {
      case 1:
        return "Music";
      case 2:
        return "Tech";
      case 3:
        return "Business";
      case 4:
        return "Sports";
      case 5:
        return "Arts";
      default:
        return "";
    }
  };

  // Helper function to get category style
  const getCategoryStyle = (categoryId: number) => {
    if (!categoryId) return "bg-slate-100 text-slate-800";

    switch (categoryId) {
      case 1:
        return "bg-pink-100 text-pink-800"; // Music
      case 2:
        return "bg-blue-100 text-blue-800"; // Tech
      case 3:
        return "bg-indigo-100 text-indigo-800"; // Business
      case 4:
        return "bg-emerald-100 text-emerald-800"; // Sports
      case 5:
        return "bg-amber-100 text-amber-800"; // Arts
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  // Helper function to calculate tickets progress percentage
  const calculateProgress = (event: any) => {
    if (!event || !event.capacity) return 0;

    // Since we don't have sold tickets count in the event object,
    // we'll use a random number for demo purposes
    // In a real application, this would come from the backend
    const soldTickets = Math.floor(Math.random() * event.capacity);
    const percentage = Math.round((soldTickets / event.capacity) * 100);

    return {
      sold: soldTickets,
      capacity: event.capacity,
      percentage: percentage,
    };
  };

  return (
    <Card className="border border-slate-200">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="font-semibold text-lg text-slate-900">
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          // Loading state
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        ) : upcomingEvents.length === 0 ? (
          // No events state
          <div className="text-center py-8">
            <CalendarIcon className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">
              No upcoming events
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Create your first event to get started
            </p>
            <Link
              href="/admin/events"
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Go to Events
            </Link>
          </div>
        ) : (
          // Events loaded state
          <>
            {upcomingEvents.map((event, index) => {
              const progress = calculateProgress(event);
              const categoryName = getCategoryName(event.categoryId);
              const categoryStyle = getCategoryStyle(event.categoryId);
              const eventDate = formatDate(event.date);

              return (
                <div
                  key={event.id}
                  className={cn(
                    "pb-3 mb-3",
                    index < upcomingEvents.length - 1 &&
                      "border-b border-slate-200"
                  )}
                >
                  <div className="flex justify-between mb-1">
                    <h3 className="font-medium text-slate-900">{event.name}</h3>
                    {categoryName && (
                      <Badge className={categoryStyle}>{categoryName}</Badge>
                    )}
                  </div>
                  <div className="text-sm text-slate-500 mb-1">
                    <CalendarIcon className="inline-block h-3.5 w-3.5 mr-1" />
                    <span>{eventDate}</span> •
                    <span className="ml-1">{event.startTime}</span>
                  </div>
                  <div className="text-sm text-slate-500 mb-2">
                    <MapPinIcon className="inline-block h-3.5 w-3.5 mr-1" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-700">
                      <TicketIcon className="inline-block h-3.5 w-3.5 mr-1" />
                      {typeof progress === "object" && (
                        <>
                          <span>{progress.sold}</span>/
                          <span>{progress.capacity}</span> tickets sold
                        </>
                      )}
                    </span>
                    <span
                      className={cn(
                        "font-medium",
                        typeof progress === "object" &&
                          (progress.percentage >= 75
                            ? "text-green-600"
                            : progress.percentage >= 50
                              ? "text-indigo-600"
                              : progress.percentage >= 25
                                ? "text-amber-600"
                                : "text-red-600")
                      )}
                    >
                      {typeof progress === "object"
                        ? `${progress.percentage}%`
                        : "0%"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                    <div
                      className={cn(
                        "h-1.5 rounded-full",
                        typeof progress === "object" &&
                          (progress.percentage >= 75
                            ? "text-green-600"
                            : progress.percentage >= 50
                              ? "text-indigo-600"
                              : progress.percentage >= 25
                                ? "text-amber-600"
                                : "text-red-600")
                      )}
                      style={{
                        width: `${typeof progress === "object" && progress.percentage}%`,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}

            <Link
              href="/admin/events"
              className="mt-3 text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center justify-center"
            >
              View all events
              <ChevronRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingEvents;
