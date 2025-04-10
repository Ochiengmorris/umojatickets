import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import Sidebar from "@/components/seller/Sidebar";
import MobileNavbar from "@/components/seller/MobileNavbar";
import { redirect } from "next/navigation";
import "../globals.css";

export const metadata: Metadata = {
  title: "UmojaTickets: Buy & Sell Tickets for Events & Concerts",
  description:
    "UmojaTickets is a leading ticketing platform in Kenya for events and concerts, offering easy ticket purchases and seamless event management for both organizers and attendees.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth(); // Server-side auth

  // Redirect unauthenticated users
  if (!userId) {
    redirect("/"); // or wherever your login page is
  }

  // TODO: cover this with a component that checks if a user is admin

  return (
    <div className="flex h-full bg-gray-100">
      <Sidebar />
      <MobileNavbar />
      <main className="flex-1 overflow-y-auto md:ml-64 lg:ml-72 pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
