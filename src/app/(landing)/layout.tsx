import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";

import { Geist, Montserrat } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={` ${montserrat.variable} ${geistSans.variable} antialiased flex flex-col h-screen bg-landingwhite `}
    >
      <Header />
      <main className="grow mt-6 ">{children}</main>
      <Footer />
    </div>
  );
}
