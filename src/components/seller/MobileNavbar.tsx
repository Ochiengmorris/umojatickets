import { Menu } from "lucide-react";
import React from "react";
import logo from "@/images/logo/logo-icon-blue.png";
import Image from "next/image";

const MobileNavbar = () => {
  return (
    <>
      {/* Mobile Navbar */}
      <div className="md:hidden bg-primary text-slate-900 fixed top-0 inset-x-0 z-30 h-16 flex items-center justify-between px-4 shadow-lg">
        <div className="flex items-center">
          {/* <svg
            className="h-7 w-7 text-indigo-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm1-8h4v2h-6V7h2v5z" />
          </svg> */}
          <Image
            src={logo}
            alt="logo"
            className=""
            width={50}
            height={50}
            priority
          />
          <span className="text-lg font-bold italic">Umojatickets</span>
        </div>

        <button className="text-white bg-jmprimary hover:bg-jmprimary focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md p-2">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </>
  );
};

export default MobileNavbar;
