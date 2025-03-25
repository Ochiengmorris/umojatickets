import Footer from "@/components/layout/Footer";

import type { Metadata } from "next";

import "../globals.css";
import HeaderAdmin from "@/components/layout/HeaderAdmin";
import AdminSheet from "@/components/admin/AdminSheet";
import BalanceCard from "@/components/BalanceCard";

export const metadata: Metadata = {
  title: "UmojaTickets: Buy & Sell Tickets for Events & Concerts",
  description:
    "UmojaTickets is a leading ticketing platform in Kenya for events and concerts, offering easy ticket purchases and seamless event management for both organizers and attendees.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full flex flex-col">
      <HeaderAdmin />
      <section className="w-full flex-1 max-w-[1380px] mx-auto md:overflow-y-hidden flex">
        <AdminSheet />
        <main
          className="grow overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {children}
        </main>
        <article className="hidden lg:block w-1/4">
          <BalanceCard />
        </article>
      </section>
      <Footer />
    </div>
  );
}
