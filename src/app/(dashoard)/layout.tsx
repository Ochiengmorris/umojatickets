import Footer from "@/components/layout/Footer";

import type { Metadata } from "next";

import "../globals.css";
import HeaderAdmin from "@/components/layout/HeaderAdmin";
import AdminSheet from "@/components/admin/AdminSheet";
import BalanceCard from "@/components/seller/BalanceCard";
import Sidebar from "@/components/seller/Sidebar";
import MobileNavbar from "@/components/seller/MobileNavbar";

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
    <div className="flex h-screen bg-gray-200">
      <Sidebar />
      {/* <MobileNavbar /> */}
      <main className="flex-1 overflow-y-auto md:ml-64 lg:ml-72 pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
