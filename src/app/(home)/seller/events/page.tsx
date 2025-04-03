import SellerEventList from "@/components/seller/SellerEventList";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SellerEventsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  return (
    <div className="h-full bg-background">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border bg-card text-card-foreground rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/seller"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>

              <h1 className="text-2xl font-bold">My Events</h1>
            </div>
            <Link
              href="/seller/new-event"
              className="flex px-2.5 py-1.5 items-center justify-center gap-2 bg-jmprimary text-black md:px-4 md:py-2 rounded-lg hover:bg-jmprimary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Event
            </Link>
          </div>
          <p className="ml-9 text-sm text-gray-500">
            Manage your event listings and track sales
          </p>
        </div>

        {/* Event List */}
        <div className="border bg-card text-card-foreground rounded-xl shadow-sm p-6">
          <SellerEventList />
        </div>
      </div>
    </div>
  );
}
