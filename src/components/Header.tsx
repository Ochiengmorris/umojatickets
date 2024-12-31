import SearchBar from "@/components/SearchBar";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import UserButton from "./UserButton";

function Header() {
  return (
    <div className="border-b bg-background">
      <div className="flex max-w-[1900px] m-auto flex-col lg:flex-row items-center gap-4 p-4">
        <div className="flex items-center justify-between w-full lg:w-auto ">
          <Link href="/" className="shrink-0">
            <h1 className="text-2xl " style={{ fontWeight: 1000 }}>
              <span className=" text-green-600">Tuka</span>
              <span>Tickets</span>
            </h1>
          </Link>

          <div className="lg:hidden">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-gray-100 text-gray-800 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-200 transition border border-gray-300">
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
                <button className="bg-green-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-green-700 transition font-semibold">
                  Sell Tickets
                </button>
              </Link>

              <Link href="/tickets" className="shrink-0">
                <button className="bg-primary text-primary-foreground shadow hover:bg-primary/90 px-3 py-2 text-sm rounded-lg font-semibold transition">
                  My Tickets
                </button>
              </Link>
              {/* <UserButton /> */}
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
              <button className="w-full bg-green-600 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-green-700 transition font-semibold">
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
