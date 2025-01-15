"use client";

import { CalendarDays, LoaderIcon } from "lucide-react";
import BalanceCard from "./BalanceCard";
import EarningsChart from "./EarningsChart";
import RecentTrstionsCard from "./RecentTrstionsCard";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import FormatMoney from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

const AdmnBalance = () => {
  const { user } = useUser();

  // Always call hooks at the top level, even if user is undefined
  const totalEarnings = useQuery(
    api.tickets.calculateTotalEarnings,
    user ? { userId: user.id } : "skip"
  );

  // Conditional rendering after hooks
  if (!user)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LoaderIcon className="w-8 h-8 animate-spin" />
      </div>
    );

  return (
    <div className="pt-4 mx-4 lg:mx-8">
      {/* Balance and activities */}
      <div className="lg:hidden">
        <BalanceCard />
      </div>

      {/* Total Earnings */}
      <div>
        <h1 className="font-semibold mt-8 lg:mt-0 mb-4 text-2xl">
          Total Earnings
        </h1>
        <div className="flex items-baseline gap-1">
          {totalEarnings != null ? (
            <span className="text-2xl">{FormatMoney(totalEarnings)}</span>
          ) : (
            <Skeleton className="w-20 h-5 rounded-md mr-1" />
          )}
          <p className="text-sm ">KSH</p>
        </div>
        <div className="flex items-center gap-2 mb-4 text-primary/70">
          <CalendarDays className="w-4 h-4" />
          <span className="text-sm font-medium ">
            From 2023-08-25 to 2023-08-25
          </span>
        </div>

        {/* earnigs chart */}
        <EarningsChart />
      </div>

      {/* recent transactions */}
      <div>
        <div className="mt-8 mb-4 flex justify-between">
          <h1 className="font-semibold text-2xl">Recent Transactions</h1>
          <button
            className="text-primary/80 text-sm underline font-medium"
            disabled
          >
            View All
          </button>
        </div>

        <div className="">
          {/* Transaction card */}
          <RecentTrstionsCard />
        </div>
      </div>
    </div>
  );
};

export default AdmnBalance;
