import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 bg-landingsecondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-white mb-6">
          Ready to experience amazing events?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of people who use UmojaTickets to discover and book
          tickets to the most exciting events happening near them.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/event"
            className="px-6 py-4 bg-white hover:bg-neutral-100 text-landingsecondary font-semibold rounded-md transition duration-300"
          >
            Explore Events
          </Link>
          <Link
            href="#how-it-works"
            className="px-6 py-4 bg-transparent hover:bg-primary-dark text-white border border-white font-semibold rounded-md transition duration-300"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
