import EventCardSkeleton from "@/components/events/EventCardSkeleton";
import Link from "next/link";
import React from "react";
import { api } from "../../../../convex/_generated/api";
import { getConvexClient } from "@/lib/convex";
import EventCard from "@/components/events/EventCard";

const convex = getConvexClient();

export default async function FeaturedEventsSection() {
  const events =
    (await convex.query(api.events.get))
      .filter((e) => e.eventDate < Date.now())
      .splice(0, 3) || [];

  // Generate skeleton loaders when loading
  const renderSkeletons = () => {
    return Array.from({ length: 3 }).map((_, index) => (
      <EventCardSkeleton key={index} />
    ));
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold font-montserrat text-neutral-800">
              Featured Events
            </h2>
            <p className="text-lg text-neutral-600 mt-2">
              Don't miss out on these popular events
            </p>
          </div>
          <Link
            href="/events"
            className="hidden md:flex items-center text-primary hover:text-primary-dark font-medium"
          >
            View All Events
            <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!events && renderSkeletons()}
          {events &&
            events.map((event) => (
              <EventCard key={event._id} eventId={event._id} motionkey={1.5} />
            ))}
          {events && events.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-neutral-500">
                No featured events at the moment. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
