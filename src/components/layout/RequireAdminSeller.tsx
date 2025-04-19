import { getConvexClient } from "@/lib/convex";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { api } from "../../../convex/_generated/api";

// HTTP client for server components
const convex = getConvexClient();

export default async function RequireAdminSeller({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  // Check if user is admin seller via Convex
  const userDetails = await convex.query(api.users.getUserById, { userId });

  if (!userDetails?.isSeller) {
    //TODO: make an unauthorized page
    // For now, redirect to home page
    redirect("/seller");
  }

  return <>{children}</>;
}
