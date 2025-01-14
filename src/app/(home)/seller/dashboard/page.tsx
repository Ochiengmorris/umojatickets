import { EventSummary } from "@/components/EventSummary";
import React from "react";

const SellerDashboard = () => {
  return (
    <div>
      <div className="mt-6 grid px-4 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <EventSummary />
      </div>
    </div>
  );
};

export default SellerDashboard;
