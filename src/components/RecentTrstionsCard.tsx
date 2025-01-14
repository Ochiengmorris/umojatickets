import React from "react";

const recentTransactios = [
  {
    id: 1,
    date: "2023-08-25",
    amount: "5000",
    type: "Payment",
    note: "Payout for chris brown concert",
    status: "Completed",
  },
  {
    id: 2,
    date: "2023-08-25",
    amount: "5000",
    type: "Payment",
    note: "Payout for chris brown concert",
    status: "Completed",
  },
  {
    id: 3,
    date: "2023-08-25",
    amount: "5000",
    type: "Payment",
    note: "Payout for chris brown concert",
    status: "Completed",
  },
];

const RecentTrstionsCard = () => {
  return (
    <div
      className="bg-card mb-8 max-h-[285px] border rounded-xl overflow-y-auto"
      style={{ scrollbarWidth: "none" }}
    >
      {/* Recent Transactions */}
      {recentTransactios.map((transaction) => (
        <div
          key={transaction.id}
          className="border-b border-primary/30 last:border-0 px-4 py-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{transaction.note}</p>
              <p className="text-sm text-muted-foreground">
                {transaction.date}
              </p>
            </div>
            <p className="text-sm font-medium">
              <span className="text-xs font-normal">KSH</span>{" "}
              {transaction.amount}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentTrstionsCard;
