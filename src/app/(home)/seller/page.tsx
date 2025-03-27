import SellerDashboard from "@/components/seller/SellerDashboard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SellerPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  return (
    <div className="bg-background">
      <SellerDashboard />
    </div>
  );
}
