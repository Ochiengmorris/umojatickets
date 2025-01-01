"use client";

import { createStripeConnectAccountLink } from "@/actions/createStripeConnectAccountLink";
import { createStripeConnectCustomer } from "@/actions/createStripeConnectCustomer";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import { createStripeConnectLoginLink } from "@/actions/createStripeConnectLoginLink";
import type { AccountStatus } from "@/actions/getStripeConnectAccountStatus";
import { getStripeConnectAccountStatus } from "@/actions/getStripeConnectAccountStatus";
import Spinner from "@/components/Spinner";
import { CalendarDays, Cog, Plus } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";

export default function SellerDashboard() {
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [accountLinkCreatePending, setAccountLinkCreatePending] =
    useState(false);
  const [error, setError] = useState(false);
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(
    null
  );
  const { theme } = useTheme();
  const router = useRouter();
  const { user } = useUser();
  const stripeConnectId = useQuery(api.users.getUsersStripeConnectId, {
    userId: user?.id || "",
  });

  const isReadyToAcceptPayments =
    accountStatus?.isActive && accountStatus?.payoutsEnabled;

  const fetchAccountStatus = useCallback(async () => {
    if (stripeConnectId) {
      try {
        const status = await getStripeConnectAccountStatus(stripeConnectId);
        setAccountStatus(status);
      } catch (error) {
        console.error("Error fetching account status:", error);
      }
    }
  }, [stripeConnectId]);

  useEffect(() => {
    if (stripeConnectId) {
      fetchAccountStatus();
    }
  }, [stripeConnectId, fetchAccountStatus]);

  if (stripeConnectId === undefined) {
    return (
      <div className=" absolute top-1/2 right-1/2">
        <Spinner />
      </div>
    );
  }

  const handleManageAccount = async () => {
    try {
      if (stripeConnectId && accountStatus?.isActive) {
        const loginUrl = await createStripeConnectLoginLink(stripeConnectId);
        window.location.href = loginUrl;
      }
    } catch (error) {
      console.error("Error accessing Stripe Connect portal:", error);
      setError(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="rounded-xl text-card-foreground overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#00c9aa] to-[#00a184] px-6 py-8 text-black shadow rounded-b-xl mb-4">
          <h2 className="text-2xl font-bold">Seller Dashboard</h2>
          <p className="text-black mt-2 text-sm md:text-base">
            Manage your seller profile and payment settings
          </p>
        </div>

        {/* Main Content */}
        {isReadyToAcceptPayments && (
          <>
            <div className="border bg-card text-card-foreground shadow p-8 rounded-xl">
              <h2 className="text-2xl font-semibold mb-6">
                Sell tickets for your events
              </h2>
              <p className="text-secondary-foreground/60 text-sm md:text-base mb-8">
                List your tickets for sale and manage your listings
              </p>
              <div className="border bg-card text-card-foreground  rounded-xl shadow-sm  p-4">
                <div className="flex justify-center gap-4">
                  <Link
                    href="/seller/new-event"
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-sm">Create Event</span>
                  </Link>
                  <Link
                    href="/seller/events"
                    className={`flex items-center gap-2 ${
                      theme === "dark"
                        ? "text-gray-200 bg-gray-100/10 hover:bg-gray-100/20"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }  px-4 py-2 rounded-lg  transition-colors`}
                  >
                    <CalendarDays className="w-5 h-5" />
                    <span className="text-sm">View My Events</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* <hr className="my-8" /> */}
            <div className="my-4" />
          </>
        )}

        <div className="p-6 border rounded-xl">
          {/* Account Creation Section */}
          {!stripeConnectId && !accountCreatePending && (
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold mb-4">
                Start Accepting Payments
              </h3>
              <p className="text-secondary-foreground/60 mb-6">
                Create your seller account to start receiving payments securely
                through Stripe
              </p>
              <button
                onClick={async () => {
                  setAccountCreatePending(true);
                  setError(false);
                  try {
                    await createStripeConnectCustomer();
                    setAccountCreatePending(false);
                  } catch (error) {
                    console.error(
                      "Error creating Stripe Connect customer:",
                      error
                    );
                    setError(true);
                    setAccountCreatePending(false);
                  }
                }}
                className="bg-[#00c9aa] text-white px-6 py-2 rounded-lg hover:bg-[#00c9aa] transition-colors"
              >
                Create Seller Account
              </button>
            </div>
          )}

          {/* Account Status Section */}
          {stripeConnectId && accountStatus && (
            <div className="space-y-6">
              {/* Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Account Status Card */}
                <div className="border bg-card text-card-foreground shadow rounded-lg p-4">
                  <h3 className="text-sm font-medium">Account Status</h3>
                  <div className="mt-2 flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        accountStatus.isActive
                          ? "bg-[#00c9aa]"
                          : "bg-yellow-500"
                      }`}
                    />
                    <span className="text-lg font-semibold">
                      {accountStatus.isActive ? "Active" : "Pending Setup"}
                    </span>
                  </div>
                </div>

                {/* Payments Status Card */}
                <div className="border bg-card text-card-foreground shadow rounded-lg p-4">
                  <h3 className="text-sm font-medium">Payment Capability</h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center">
                      <svg
                        className={`w-5 h-5 ${
                          accountStatus.chargesEnabled
                            ? "text-[#00c9aa]"
                            : "text-gray-400"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2 ">
                        {accountStatus.chargesEnabled
                          ? "Can accept payments"
                          : "Cannot accept payments yet"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className={`w-5 h-5 ${
                          accountStatus.payoutsEnabled
                            ? "text-[#00c9aa]"
                            : "text-gray-400"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2">
                        {accountStatus.payoutsEnabled
                          ? "Can receive payouts"
                          : "Cannot receive payouts yet"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements Section */}
              {accountStatus.requiresInformation && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-yellow-800 mb-3">
                    Required Information
                  </h3>
                  {accountStatus.requirements.currently_due.length > 0 && (
                    <div className="mb-3">
                      <p className="text-yellow-800 font-medium mb-2">
                        Action Required:
                      </p>
                      <ul className="list-disc pl-5 text-yellow-700 text-sm">
                        {accountStatus.requirements.currently_due.map((req) => (
                          <li key={req}>{req.replace(/_/g, " ")}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {accountStatus.requirements.eventually_due.length > 0 && (
                    <div>
                      <p className="text-yellow-800 font-medium mb-2">
                        Eventually Needed:
                      </p>
                      <ul className="list-disc pl-5 text-yellow-700 text-sm">
                        {accountStatus.requirements.eventually_due.map(
                          (req) => (
                            <li key={req}>{req.replace(/_/g, " ")}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                  {/* Only show Add Information button if there are requirements */}
                  {!accountLinkCreatePending && (
                    <button
                      onClick={async () => {
                        setAccountLinkCreatePending(true);
                        setError(false);
                        try {
                          const { url } =
                            await createStripeConnectAccountLink(
                              stripeConnectId
                            );
                          router.push(url);
                        } catch (error) {
                          console.error(
                            "Error creating Stripe Connect account link:",
                            error
                          );
                          setError(true);
                        }
                        setAccountLinkCreatePending(false);
                      }}
                      className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Complete Requirements
                    </button>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                {accountStatus.isActive && (
                  <button
                    onClick={handleManageAccount}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center"
                  >
                    <Cog className="w-4 h-4 mr-2" />
                    Seller Dashboard
                  </button>
                )}
                <button
                  onClick={fetchAccountStatus}
                  className={`px-4 py-2 rounded-lg ${
                    theme === "dark"
                      ? "text-gray-200 bg-gray-100/10 hover:bg-gray-100/20"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }  transition-colors`}
                >
                  Refresh Status
                </button>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 text-green-600 p-3 rounded-lg">
                  Unable to access Stripe dashboard. Please complete all
                  requirements first.
                </div>
              )}
            </div>
          )}

          {/* Loading States */}
          {accountCreatePending && (
            <div className="text-center py-4">
              Creating your seller account...
            </div>
          )}
          {accountLinkCreatePending && (
            <div className="text-center py-4">Preparing account setup...</div>
          )}
        </div>
      </div>
    </div>
  );
}
