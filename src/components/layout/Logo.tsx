"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/images/logo/logo.png";
import dark_logo from "@/images/logo/logo-dark.png";
import { useTheme } from "next-themes";

const Logo = () => {
  const { theme } = useTheme();
  // console.log(theme);
  return (
    <Link href="/" className="shrink-0">
      <h1
        className="items-center justify-center flex"
        style={{ fontWeight: 1000 }}
      >
        <span className="">
          <Image
            src={theme === "dark" || theme === "system" ? dark_logo : logo}
            width={37}
            alt="logo"
          />
        </span>
        <span className="text-2xl">Tickets</span>
      </h1>
    </Link>
  );
};

export default Logo;
