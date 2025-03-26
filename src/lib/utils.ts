import { clsx, type ClassValue } from "clsx";
import { useQuery } from "convex/react";
import { twMerge } from "tailwind-merge";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useStorageUrl(storageId: Id<"_storage"> | undefined) {
  return useQuery(api.storage.getUrl, storageId ? { storageId } : "skip");
}

export const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove non-digit characters
  const cleanPhoneNumber = phoneNumber.replace(/\D/g, "");
  if (cleanPhoneNumber.startsWith("07") || cleanPhoneNumber.startsWith("01")) {
    return `254${cleanPhoneNumber.slice(1)}`; // Convert to Kenyan international format
  }
  if (cleanPhoneNumber.startsWith("254") && cleanPhoneNumber.length === 12) {
    return cleanPhoneNumber; // Already in international format
  }
  throw new Error("Invalid phone number format"); // For invalid phone numbers
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString(undefined, options);
};

{
  /* This formats money numbers to the international format  */
}
const FormatMoney: (amount?: number) => string = (amount) => {
  if (amount === undefined) {
    return ""; // Or return "0" or any other default value you prefer
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export default FormatMoney;
