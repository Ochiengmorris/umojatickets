import { textVariant } from "@/constants/motion";
import { getConvexClient } from "@/lib/convex";
import { motion } from "framer-motion";
import { api } from "../../../../convex/_generated/api";
import EventCardSkeleton from "@/components/events/EventCardSkeleton";
import EventCard from "@/components/events/EventCard";
import Link from "next/link";

const convex = getConvexClient();

const Upcoming = async () => {
  const events =
    (await convex.query(api.events.get))
      .filter((e) => e.eventDate > Date.now())
      .splice(0, 3) || [];

  // Generate skeleton loaders when loading
  const renderSkeletons = () => {
    return Array.from({ length: 3 }).map((_, index) => (
      <EventCardSkeleton key={index} />
    ));
  };
  return (
    <section className="py-14 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-center">
          {/* section subheading */}
          <p className="sm:text-[18px] text-[14px] text-landingprimary uppercase tracking-wider">
            Browse events happening soon
          </p>

          {/* section heading */}
          <h2
            className={
              "text-landingsecondary sm:text-[50px] xs:text-[40px] text-[30px] font-bold"
            }
          >
            Upcoming Events
          </h2>

          <div className="mt-6 grid grid-cols-1 w-full md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* {!events && renderSkeletons()} */}
            {events &&
              events.map((event) => (
                <EventCard key={event._id} eventId={event._id} motionkey={1} />
              ))}
            {/* {events && events.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-neutral-500">
                  No upcoming events at the moment. Check back soon!
                </p>
              </div>
            )} */}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/events"
              className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
            >
              View All Upcoming Events
              <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Upcoming;
