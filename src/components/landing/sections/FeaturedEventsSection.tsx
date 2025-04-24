import EventCardSkeleton from "@/components/events/EventCardSkeleton";
import Link from "next/link";
import React from "react";
import { api } from "../../../../convex/_generated/api";
import { getConvexClient } from "@/lib/convex";
import FeaturedCard from "../FeaturedCard";
import { fetchQuery } from "convex/nextjs";

const convex = getConvexClient();

export default async function FeaturedEventsSection() {
  const events =
    (await fetchQuery(api.events.get))
      .filter((e) => e.eventDate > Date.now())
      .splice(0, 3) || [];

  console.log("events", events);

  // Generate skeleton loaders when loading
  const renderSkeletons = () => {
    return Array.from({ length: 3 }).map((_, index) => (
      <EventCardSkeleton key={index} />
    ));
  };

  return (
    <section className="py-16 bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className=" text-landingsecondary sm:text-[50px] xs:text-[40px] text-[30px] font-bold">
              Featured Events
            </h2>
            <p className="sm:text-[18px] text-[14px] text-landingprimary uppercase tracking-wider">
              Don't miss out on these popular events
            </p>
          </div>
          <Link
            href="/events"
            className="hidden md:flex items-center text-landingsecondary hover:underline font-medium"
          >
            View All Events
            <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {!events && renderSkeletons()}
          {events &&
            events.map((event) => (
              <FeaturedCard key={event._id} eventId={event._id} />
            ))}
          {events && events.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-neutral-500">
                No featured events at the moment. Check back soon!
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/events"
            className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
          >
            View All Events
            <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
