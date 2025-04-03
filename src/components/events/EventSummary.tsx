"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Ticket, Users } from "lucide-react";

const summaryItems = [
  {
    title: "Total Events",
    value: "12",
    icon: CalendarDays,
    color: "text-jmprimary",
  },
  {
    title: "Upcoming Events",
    value: "3",
    icon: Ticket,
    color: "text-jmprimary",
  },
  {
    title: "Total Attendees",
    value: "1,234",
    icon: Users,
    color: "text-jmprimary",
  },
];

export function EventSummary() {
  return (
    <>
      {summaryItems.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
