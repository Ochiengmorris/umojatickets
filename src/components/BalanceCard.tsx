"use client";

import { usePathname } from "next/navigation";

const payoutActivities = [
  {
    id: 1,
    date: "2023-08-25",
    amount: "KSH 5000.00",
    status: "Completed",
  },
  {
    id: 2,
    date: "2023-08-25",
    amount: "KSH 5000.00",
    status: "Completed",
  },
  {
    id: 3,
    date: "2023-08-25",
    amount: "KSH 5000.00",
    status: "Completed",
  },
];
const BalanceCard = () => {
  const pathname = usePathname();

  if (pathname.endsWith("/overview")) {
    return (
      <>
        <div className="lg:mt-4 lg:mr-4">
          <h1 className="font-semibold mb-4 text-2xl">Balance</h1>
          <div className="flex lg:flex-col">
            <div className="pr-4 lg:px-0 lg:flex lg:justify-between border-r lg:border-none border-primary/30">
              <p className="mb-2 text-muted-foreground">Total balance</p>
              <h2 className="text-primary/80 font-semibold">
                <span className="text-xs font-normal text-primary/50">KSH</span>{" "}
                5,000.00
              </h2>
            </div>
            <div className="px-4 lg:px-0 lg:flex lg:justify-between  border-r lg:border-none border-primary/30">
              <p className="mb-2 text-muted-foreground">Total payouts</p>
              <h2 className="text-primary/80 font-semibold">
                <span className="text-xs font-normal text-primary/50">KSH</span>{" "}
                5,000.00
              </h2>
            </div>
            <div className="px-4 lg:px-0 lg:flex lg:justify-between  border-r lg:border-none border-primary/30">
              <p className="mb-2 text-muted-foreground">On the way</p>
              <h2 className="text-primary/80 font-semibold">
                <span className="text-xs font-normal text-primary/50">KSH</span>{" "}
                5,000.00
              </h2>
            </div>
          </div>
        </div>

        {/* Activities */}
        {/* <div className="lg:mr-4">
          <h1 className="font-semibold mt-8 mb-4 text-2xl">Activities</h1>

          {payoutActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between mb-4"
            >
              <div className="flex items-center">
                <span className="mr-4 text-muted-foreground">
                  {activity.date}
                </span>
                <span className="text-primary/80 font-semibold">
                  {activity.amount}
                </span>
              </div>
              <span className="text-muted-foreground">{activity.status}</span>
            </div>
          ))}
        </div> */}
      </>
    );
  }
};

export default BalanceCard;
