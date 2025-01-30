"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const Header = () => {
  return (
    // make this sticky top-0
    <div className="">
      <p className="text-sm text-landingsecondary/50 text-center border-b border-landingsecondary/20">
        This page is still under constuction. Please come back later!
      </p>
      <div className="flex items-center justify-between px-5 lg:px-10 py-5 w-full max-w-[1440px] mx-auto">
        <div className="flex items-center ">
          <h1 className="text-landingsecondary font-[1000] text-xl lg:text-3xl md:text-2xl xl:text-4xl cursor-pointer">
            <span className="text-landingprimary">Umoja</span>
            Tickets
          </h1>
        </div>

        <div>
          <Button
            className={cn(
              "lg:px-5 md:px-6 lg:py-6 rounded-xl lg:text-lg  border-landingprimary/50 border text-landingsecondary bg-transparent hover:bg-landingsecondary hover:text-landingwhite transition-colors duration-300 ease-in-out"
            )}
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Header;
