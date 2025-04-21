"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-neutral-800 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1655882511099-a0db52b01ba3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGV2ZW50JTIwbXVzaWN8ZW58MHx8MHx8fDA%3D"
          alt="Concert crowd"
          className="w-full h-full object-cover opacity-40"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center md:text-left md:max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat text-white leading-tight mb-6">
            Discover & Book
            <br />
            <span className="text-jmprimary">Live Events</span>
          </h1>
          <p className="text-lg md:text-xl text-white opacity-90 mb-8 max-w-2xl md:max-w-3xl">
            Find and book tickets to the hottest concerts, festivals, theater
            performances, and more, all in one place.
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <Link
              href="/events"
              className="px-8 py-4 bg-card-foreground hover:bg-card-foreground/60 text-white font-medium rounded-md transition duration-300 text-center"
            >
              Explore Events
            </Link>
            <Link
              href="#categories"
              className="px-8 py-4 bg-white hover:bg-neutral-100 text-primary font-medium rounded-md transition duration-300 text-center"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
