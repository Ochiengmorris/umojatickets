import Sidebar from "@/components/seller/Sidebar";
import MobileNavbar from "@/components/seller/MobileNavbar";
import type { Metadata } from "next";
import "../globals.css";
import RequireAdminSeller from "@/components/layout/RequireAdminSeller";

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
  return (
    <RequireAdminSeller>
      <div className="flex h-full bg-gray-100">
        <Sidebar />
        <MobileNavbar />
        <main className="flex-1 overflow-y-auto md:ml-64 lg:ml-72 pt-16 md:pt-0">
          {children}
        </main>
      </div>
    </RequireAdminSeller>
  );
}
