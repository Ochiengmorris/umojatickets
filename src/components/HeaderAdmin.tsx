"use client";

import {
  SignInButton,
  SignedIn,
  UserButton,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Link from "next/link";
import AdminSidebar from "./AdminSidebar";
import { useEffect, useState } from "react";

function HeaderAdmin() {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>("");
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      setUserName(user.firstName);
    }
  }, [user]);

  return (
    <div className="border-b bg-background sticky z-50 top-0 ">
      <div className="flex max-w-[1900px] justify-center m-auto w-full flex-row items-center gap-4 px-4 py-2 md:py-4">
        <div className="flex items-center justify-between w-full">
          <button className="md:hidden" onClick={() => setOpen(true)}>
            <Menu className="size-6" />
          </button>

          <Link href="/" className="shrink-0">
            <h1 className="text-xl " style={{ fontWeight: 1000 }}>
              <span className="md:hidden text-[#00c9AA] bg-black border inline-flex  justify-center text-base md:text-lg px-2 rounded-r-xl items-center mr-1">
                U{" "}
              </span>
              <span className="hidden md:inline-flex text-[#00c9AA]">
                Umoja
              </span>
              <span className="text-base md:text-lg">Tickets</span>
              <span className="mx-2 md:hidden text-sm md:text-lg text-[#00c9AA]">
                /
              </span>
              <span className="md:hidden text-sm md:text-xl text-[#00c9AA] uppercase">
                {userName}
              </span>
            </h1>
          </Link>

          <Link
            href="/admin/events"
            className="hidden text-md md:inline-flex text-[#00c9AA] uppercase"
          >
            <span style={{ fontWeight: 1000 }}>{userName}</span>
          </Link>

          <div className="">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-primary text-primary-foreground shadow hover:bg-primary/90 px-3 py-2 text-sm rounded-lg font-semibold transition  ">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>

      {/* sheet */}
      <AdminSidebar open={open} setOpen={setOpen} />
    </div>
  );
}

export default HeaderAdmin;
