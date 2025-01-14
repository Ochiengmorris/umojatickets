import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import Footer from "@/components/Footer";
import SyncUserWithConvex from "@/components/SyncUserWithConvex";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";
import "../globals.css";
import HeaderAdmin from "@/components/HeaderAdmin";
import AdminSheet from "@/components/AdminSheet";
import BalanceCard from "@/components/BalanceCard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <section className="w-full flex-1 max-w-[1380px] mx-auto overflow-y-hidden flex">
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
