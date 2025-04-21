import SearchBar from "@/components/layout/SearchBar";
import UserButton from "@/components/other/UserButton";
import logo_blue from "@/images/logo/logo-blue.png";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

function Header() {
  return (
    <header className="border-b bg-background/90 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      <div className="flex max-w-7xl m-auto flex-col lg:flex-row items-center gap-4 p-4 relative">
        <div className="flex lg:max-w-[100px] items-center w-full lg:mr-12">
          <Link href="/" className="flex items-center">
            <Image
              src={logo_blue}
              width={200}
              height={200}
              alt="logo"
              className="object-contain w-[100px] h-[100px] md:w-[140px] md:h-[140px] absolute left-2"
              priority
            />
          </Link>

          <div className="lg:hidden ml-auto">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-primary text-primary-foreground shadow hover:bg-primary/90 px-3 py-2 text-sm rounded-lg font-semibold transition">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>

        {/* Search Bar - Full width on mobile */}
        {/* <div className="justify-start w-full lg:flex-1 lg:max-w-2xl ">
          <SearchBar />
        </div> */}

        <div className="hidden lg:flex ml-auto">
          <SignedIn>
            <div className="flex items-center gap-3">
              {/* <Link href="/seller" className="shrink-0">
                <button className="bg-primary/5 text-primary px-3 py-2 text-sm rounded-lg hover:bg-primary/20 transition-all duration-200 ease-in-out font-semibold">
                  Sell Tickets
                </button>
              </Link>

              <Link href="/tickets" className="shrink-0">
                <button className="bg-primary text-primary-foreground shadow hover:bg-primary/90 px-3 py-2 text-sm rounded-lg font-semibold transition">
                  My Tickets
                </button>
              </Link> */}
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
        {/* <div className="lg:hidden w-full flex justify-center gap-3">
          <SignedIn>
            <Link href="/seller" className="flex-1">
              <button className="bg-[#ffcd08]/5 text-primary px-3 py-1.5 text-sm rounded-lg hover:bg-[#ffcd08]/50 transition-all duration-200 ease-in-out font-semibold w-full">
                Sell Tickets
              </button>
            </Link>

            <Link href="/tickets" className="flex-1">
              <button className="w-full bg-primary text-primary-foreground shadow hover:bg-primary/90 font-semibold px-3 py-1.5 text-sm rounded-lg  transition">
                My Tickets
              </button>
            </Link>
          </SignedIn>
        </div> */}
      </div>
    </header>
  );
}

export default Header;
