import { Menu } from "lucide-react";
import React from "react";
import logo from "@/images/logo/logo-icon-blue.png";
import Image from "next/image";

const MobileNavbar = () => {
  return (
    <>
      {/* Mobile Navbar */}
      <div className="md:hidden bg-black text-gray-300 fixed top-0 inset-x-0 z-30 h-16 flex items-center justify-between px-4 shadow-lg">
        <div className="flex items-center">
          <Image
            src={logo}
            alt="logo"
            className=""
            width={50}
            height={50}
            priority
          />
          <span className="text-2xl text-jmprimary  font-extrabold italic">
            Umojatickets
          </span>
        </div>

        <button className="text-white bg-jmprimary hover:bg-jmprimary/60 rounded-md p-2">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </>
  );
};

export default MobileNavbar;
