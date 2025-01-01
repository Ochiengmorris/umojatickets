import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SyncUserWithConvex from "@/components/SyncUserWithConvex";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <Head>
        {/* Meta Tags specific to this page */}
        <meta
          name="keywords"
          content="ticketing, Kenya, events, concerts, festivals"
        />
        <meta
          property="og:title"
          content="UmojaTickets: Buy & Sell Tickets for Events & Concerts"
        />
        <meta
          property="og:description"
          content="UmojaTickets is Kenya's top platform for buying and selling event tickets, offering an easy experience for concert-goers and event organizers."
        />
        {/* <meta property="og:image" content="/path-to-your-image.jpg" /> */}
        <meta property="og:url" content="https://mj-ticketr.vercel.app/" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            <ClerkProvider>
              <Header />
              <SyncUserWithConvex />
              <main className="grow">{children}</main>
              <Footer />
              <Toaster />
            </ClerkProvider>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
