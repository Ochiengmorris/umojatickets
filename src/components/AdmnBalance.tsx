"use client";

import { CalendarDays } from "lucide-react";
import BalanceCard from "./BalanceCard";
import EarningsChart from "./EarningsChart";
import RecentTrstionsCard from "./RecentTrstionsCard";

const AdmnBalance = () => {
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
        <div>
          <p className="text-sm ">
            <span className="text-2xl ">5,000.00</span> KSH
          </p>
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
