"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { usePathname } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import FormatMoney from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const BalanceCard = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const userDetails = useQuery(api.users.getUserById, {
    userId: user ? user.id : "skip",
  });

  if (pathname.endsWith("/overview")) {
    return (
      <>
        <div className="lg:mt-4 lg:mr-4">
          <h1 className="font-semibold mb-4 text-2xl">Balance</h1>
          <div className="flex lg:flex-col">
            <div className="pr-4 lg:px-0 lg:flex lg:justify-between border-r lg:border-none border-primary/30">
              <p className="mb-2 text-muted-foreground">Available balance</p>
              <h2 className="text-primary/80 font-semibold flex items-baseline gap-1">
                <span className="text-xs font-normal text-primary/50">KSH</span>
                {userDetails != null ? (
                  <span>{FormatMoney(userDetails?.balance)}</span>
                ) : (
                  <Skeleton className="w-20 h-5 rounded-md mr-1" />
                )}
              </h2>
            </div>
            <div className="px-4 lg:px-0 lg:flex lg:justify-between  border-r lg:border-none border-primary/30">
              <p className="mb-2 text-muted-foreground">Total payouts</p>
              <h2 className="text-primary/80 font-semibold">
                <span className="text-xs font-normal text-primary/50">KSH</span>{" "}
                5,000.00
              </h2>
            </div>
            {/* <div className="px-4 lg:px-0 lg:flex lg:justify-between  border-r lg:border-none border-primary/30">
              <p className="mb-2 text-muted-foreground">On the way</p>
              <h2 className="text-primary/80 font-semibold">
                <span className="text-xs font-normal text-primary/50">KSH</span>{" "}
                5,000.00
              </h2>
            </div> */}
          </div>
        </div>
      </>
    );
  }
};

export default BalanceCard;
