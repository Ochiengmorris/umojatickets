"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import Spinner from "@/components/loaders/Spinner";
import { CalendarDays, Cog, Plus, UsersIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { becomeASeller } from "@/actions/becomeASeller";
import { useToast } from "@/hooks/use-toast";

export default function SellerDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const { toast } = useToast();

  const router = useRouter();
  const { user } = useUser();

  const userDetails = useQuery(api.users.getUserById, {
    userId: user?.id || "",
  });

  if (!userDetails) {
    return (
      <div className=" absolute top-1/2 right-1/2">
        <Spinner />;
      </div>
    );
  }

  const handleManageAccount = async () => {
    try {
      router.push(`/admin/overview`);
    } catch (error) {
      console.error("Error accessing Stripe Connect portal:", error);
      setError(true);
    }
  };

  const handleBecomeSeller = async () => {
    setIsLoading(true);
    try {
      const result = await becomeASeller();

      if (result.status === "ok") {
        toast({
          title: "Hooray!",
          description: "You have successfully become a seller!",
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error becoming a seller:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="rounded-xl text-card-foreground overflow-hidden">
        {/* Header Section */}
        <div className="bg-jmprimary px-6 py-8 text-black shadow rounded-b-xl mb-4">
          <h2 className="text-2xl font-bold">Seller Dashboard</h2>
          <p className="text-black mt-2 text-sm md:text-base">
            Manage your seller profile and payment settings
          </p>
        </div>

        {/* Main Content */}

        <>
          <div className="border bg-card text-card-foreground shadow p-8 rounded-xl">
            <h2 className="text-2xl font-semibold mb-6">
              Sell tickets for your events
            </h2>
            <p className="text-secondary-foreground/60 text-sm md:text-base mb-8">
              List your tickets for sale and manage your listings
            </p>
            <div className="border bg-card text-card-foreground  rounded-xl shadow-sm  p-4">
              {userDetails?.isSeller ? (
                <div className="flex justify-center gap-4">
                  <Link
                    href="/seller/new-event"
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-sm">
                      Create <span className="hidden sm:inline">Event</span>
                    </span>
                  </Link>
                  <Link
                    href="/seller/events"
                    className={`flex items-center gap-2 text-foreground bg-foreground/10 hover:bg-foreground/20 px-4 py-2 rounded-lg transition-colors`}
                  >
                    <CalendarDays className="w-5 h-5" />
                    <span className="text-sm text-foreground">
                      View my Events
                    </span>
                  </Link>
                </div>
              ) : (
                <p className="text-red-600 text-center">You are not a seller</p>
              )}
            </div>
          </div>

          {/* <hr className="my-8" /> */}
          <div className="my-4" />
        </>

        <div className="p-6 border rounded-xl">
          {/* Account Creation Section */}
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            {userDetails?.isSeller ? (
              <>
                <button
                  // onClick={() => router.push("/admin/overview")}
                  onClick={handleManageAccount}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center"
                >
                  <Cog className="w-4 h-4 mr-2" />
                  Seller Dashboard
                </button>

                <button
                  onClick={async () => {}}
                  className={`px-4 py-2 rounded-lg text-foreground bg-foreground/10 hover:bg-foreground/20 transition-colors`}
                >
                  Refresh Status
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleBecomeSeller}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center"
                >
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <>
                      <UsersIcon className="w-4 h-4 mr-2" />
                      Become a Seller
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {error && (
            <div className="mt-4 bg-red-50 text-green-600 p-3 rounded-lg">
              Unable to access Stripe dashboard. Please complete all
              requirements first.
            </div>
          )}
        </div>

        {/* Loading States */}
        {/* {accountCreatePending && (
            <div className="text-center py-4">
              Creating your seller account...
            </div>
          )}
          {accountLinkCreatePending && (
            <div className="text-center py-4">Preparing account setup...</div>
          )} */}
      </div>
    </div>
  );
}
