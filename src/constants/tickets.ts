// eventId: v.id("events"),
//     name: v.string(), // VIP, Normal etc
//     price: v.number(),
//     totalTickets: v.number(),

import { Id } from "../../convex/_generated/dataModel";

export const ticketTypes: ticketType[] = [
  {
    name: "VIP",
    price: 1000,
    totalTickets: 10,
  },
  {
    name: "Normal",
    price: 500,
    totalTickets: 20,
  },
  {
    name: "Student",
    price: 300,
    totalTickets: 15,
  },
];

export type ticketType = {
  name: string;
  price: number;
  totalTickets: number;
};

export type ticketTypeWithId = ticketType & {
  _id: Id<"ticketTypes">;
};
