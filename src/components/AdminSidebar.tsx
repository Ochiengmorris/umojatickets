"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "./ui/separator";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

const AdminSidebar = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [userName, setUserName] = useState<string | null>("");
  const { user } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    if (user) {
      setUserName(user.firstName);
    }
  }, [user]);

  const basePath = pathname.split("/").slice(0, -1).join("/"); // Remove the last segment
  return (
    <Sheet open={open} onOpenChange={() => setOpen(false)}>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>
            <Link href="/" className="shrink-0">
              <h1 className="text-xl " style={{ fontWeight: 1000 }}>
                <span className="inline-flex text-[#00c9AA]">Umoja</span>
                <span className="">Tickets</span>
              </h1>
            </Link>
          </SheetTitle>
          <SheetDescription>Seller {userName}</SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />
        <div className="flex flex-col w-full gap-4">
          <Link
            href={`${basePath}/overview`}
            onClick={() => setOpen(false)}
            className={`border shadow rounded-lg pl-4 ${
              pathname.endsWith("/overview") ? "text-[#00c9aa]" : ""
            } py-2 w-full bg-card font-semibold`}
          >
            Overview
          </Link>
          <Link
            href={`${basePath}/balance`}
            onClick={() => setOpen(false)}
            className={`border shadow rounded-lg pl-4 ${
              pathname.endsWith("/balance") ? "text-[#00c9aa]" : ""
            } py-2 w-full bg-card font-semibold`}
          >
            Balance
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdminSidebar;
