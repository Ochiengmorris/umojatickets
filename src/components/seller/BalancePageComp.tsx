"use client";

import { useQuery } from "convex/react";
import AdminWithdrawForm from "@/components/admin/AdminWithdrawForm";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";
import FormatMoney from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const BalancePageComp = () => {
  const { user } = useUser();
  const userDetails = useQuery(api.users.getUserById, {
    userId: user ? user.id : "skip",
  });
  return (
    <div className="pt-4 mx-4">
      <h1 className="font-semibold mb-4 text-2xl">Balance</h1>
      <div className="flex">
        <div className="pr-4 border-r  border-primary/30">
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
        <div className="px-4   border-r border-primary/30">
          <p className="mb-2 text-muted-foreground">Total payouts</p>
          <h2 className="text-primary/80 font-semibold">
            <span className="text-xs font-normal text-primary/50">KSH</span>{" "}
            5,000.00
          </h2>
        </div>
        <div className="px-4 border-r lg:border-none border-primary/30">
          <p className="mb-2 text-muted-foreground">On the way</p>
          <h2 className="text-primary/80 font-semibold">
            <span className="text-xs font-normal text-primary/50">KSH</span>{" "}
            5,000.00
          </h2>
        </div>
      </div>

      {/* request a withdrawal */}
      <div className="mt-8">
        <h1 className="font-semibold text-2xl">Withdrawal</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Request a withdarwal to your M-Pesa account.
        </p>

        {/* form */}
        <AdminWithdrawForm />
      </div>
    </div>
  );
};

export default BalancePageComp;
