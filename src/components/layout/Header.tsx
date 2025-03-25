import SearchBar from "@/components/SearchBar";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import UserButton from "../UserButton";
import Image from "next/image";
import logo from "@/images/logo/logo.png";
import Logo from "./Logo";

function Header() {
  return (
    <div className="border-b bg-background">
      <div className="flex max-w-[1600px] m-auto flex-col lg:flex-row items-center gap-4 p-4">
        <div className="flex items-center justify-between w-full lg:w-auto ">
          <Logo />

          <div className="lg:hidden">
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

        {/* Search Bar - Full width on mobile */}
        <div className="w-full lg:w-fit lg:grow lg:max-w-2xl">
          <SearchBar />
        </div>

        <div className="hidden lg:flex ml-auto">
          <SignedIn>
            <div className="flex items-center gap-3">
              <Link href="/seller" className="shrink-0">
                <button className="bg-[#00c9AA] text-gray-950 px-3 py-2 text-sm rounded-lg hover:bg-[#00c9AA]/90 transition font-semibold">
                  Sell Tickets
                </button>
              </Link>

              <Link href="/tickets" className="shrink-0">
                <button className="bg-primary text-primary-foreground shadow hover:bg-primary/90 px-3 py-2 text-sm rounded-lg font-semibold transition">
                  My Tickets
                </button>
              </Link>
              <UserButton />
            </div>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-primary text-primary-foreground shadow hover:bg-primary/90 px-3 py-2 text-sm rounded-lg font-semibold transition  ">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* Mobile Action Buttons */}
        <div className="lg:hidden w-full flex justify-center gap-3">
          <SignedIn>
            <Link href="/seller" className="flex-1">
              <button className="w-full bg-[#00c9AA] text-gray-950 px-3 py-1.5 text-sm rounded-lg hover:bg-[#00c9AA] transition font-semibold">
                Sell Tickets
              </button>
            </Link>

            <Link href="/tickets" className="flex-1">
              <button className="w-full bg-primary text-primary-foreground shadow hover:bg-primary/90 font-semibold px-3 py-1.5 text-sm rounded-lg  transition">
                My Tickets
              </button>
            </Link>
          </SignedIn>
        </div>
      </div>
    </div>
  );
}

export default Header;
