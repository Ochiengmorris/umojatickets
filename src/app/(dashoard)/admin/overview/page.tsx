"use client";

import AdmnBalance from "@/components/admin/AdmnBalance";
import RecentTickets from "@/components/seller/RecentTickets";
import RevenueChart from "@/components/seller/RevenueChart";
import StatsOverview from "@/components/seller/StatsOverview";
import UpcomingEvents from "@/components/seller/UpcomingEvents";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { DownloadIcon, PlusIcon } from "lucide-react";
import React, { useState } from "react";

const Overview = () => {
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const { user } = useUser();
  return (
    <>
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
              onClick={() => setIsCreateEventModalOpen(true)}
              className="bg-jmprimary text-primary-foreground hover:bg-jmprimary/50"
              size="sm"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              New Event
            </Button>
          </div>
        </div>

        <StatsOverview />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <RevenueChart className="lg:col-span-2" />
          <UpcomingEvents />
        </div>

        <RecentTickets />
      </div>

      {/* TODO: Create Event Modal */}
    </>
  );
};

export default Overview;
