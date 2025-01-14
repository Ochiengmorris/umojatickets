import React from "react";
import AdminWithdrawForm from "./AdminWithdrawForm";

const BalancePageComp = () => {
  return (
    <div className="pt-4 mx-4">
      <h1 className="font-semibold mb-4 text-2xl">Balance</h1>
      <div className="flex">
        <div className="pr-4 border-r  border-primary/30">
          <p className="mb-2 text-muted-foreground">Total balance</p>
          <h2 className="text-primary/80  md:text-xl">
            <span className="text-xs font-normal text-primary/50">KSH</span>{" "}
            5,000.00
          </h2>
        </div>
        <div className="px-4  border-r border-primary/30">
          <p className="mb-2 text-muted-foreground">Total payouts</p>
          <h2 className="text-primary/80 md:text-xl">
            <span className="text-xs font-normal text-primary/50">KSH</span>{" "}
            5,000.00
          </h2>
        </div>
        <div className="px-4  border-r border-primary/30">
          <p className="mb-2 text-muted-foreground">On the way</p>
          <h2 className="text-primary/80 font-normal md:text-xl">
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
