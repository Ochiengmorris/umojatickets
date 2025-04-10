"use client";

import AdmnBalance from "@/components/admin/AdmnBalance";
import RecentTickets from "@/components/seller/RecentTickets";
import RevenueChart from "@/components/seller/RevenueChart";
import StatsOverview from "@/components/seller/StatsOverview";
import UpcomingEvents from "@/components/seller/UpcomingEvents";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { DownloadIcon, PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import Spinner from "@/components/loaders/Spinner";
import { redirect } from "next/navigation";

export const mockMonthlyRevenue = [
  { month: 1, revenue: 2500 },
  { month: 2, revenue: 3800 },
  { month: 3, revenue: 4200 },
  { month: 4, revenue: 6100 },
  { month: 5, revenue: 3000 },
  { month: 6, revenue: 0 }, // no sales this month
  { month: 7, revenue: 7200 },
  { month: 8, revenue: 5100 },
  { month: 9, revenue: 0 }, // no sales this month
  { month: 10, revenue: 8600 },
  { month: 11, revenue: 9400 },
  { month: 12, revenue: 10500 },
];

const Overview = () => {
  const { user } = useUser();

  const eventMetrics = useQuery(api.events.getAllUserEventsMetrics, {
    userId: user?.id ?? "",
  });

  const eventWithMetrics = useQuery(api.events.getSellerEvents, {
    userId: user?.id ?? "",
  });

  const monthlyRevenue = useQuery(api.events.getMonthlyRevenue, {
    userId: user?.id ?? "",
  });

  const ticketDetails = useQuery(api.tickets.getAllUserTickets, {
    userId: user?.id ?? "",
  });

  console.log("ticketDetails", ticketDetails);

  // if (!eventMetrics) return <Spinner />;

  return (
    <div className="max-w-screen-xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Welcome back, {user?.fullName || user?.username}! Here's what's
            happening with your events.
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <DownloadIcon className="h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={() => redirect("/seller/new-event")}
            className="bg-jmprimary text-primary-foreground hover:bg-jmprimary/50"
            size="sm"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            New Event
          </Button>
        </div>
      </div>

      <StatsOverview stats={eventMetrics?.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <RevenueChart className="lg:col-span-2" data={mockMonthlyRevenue} />
        <UpcomingEvents events={eventWithMetrics} />
      </div>

      <RecentTickets tickets={ticketDetails} />
    </div>
  );
};

export default Overview;
