"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const AdminSheet = () => {
  const pathname = usePathname();
  const basePath = pathname.split("/").slice(0, -1).join("/"); // Remove the last segment

  return (
    <div className="hidden md:flex flex-col w-2/12 xl:w-1/12 pt-4 px-1 gap-4">
      <Link
        href={`${basePath}/overview`}
        className={`border shadow rounded-lg pl-4 ${
          pathname.endsWith("/overview") ? "text-[#00c9aa]" : ""
        } py-2 w-full bg-card font-semibold`}
      >
        Overview
      </Link>
      <Link
        href={`${basePath}/balance`} // Navigate to "/balance" relative to the base path
        className={`border shadow rounded-lg pl-4 ${
          pathname.endsWith("/balance") ? "text-[#00c9aa]" : ""
        } py-2 w-full bg-card font-semibold`}
      >
        Balance
      </Link>
    </div>
  );
};

export default AdminSheet;
