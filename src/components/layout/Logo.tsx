"use client";

import full_logo from "@/images/logo/full-logo.png";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Logo = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // if (!mounted) return null; // Prevents mismatched HTML before hydration
  return (
    <Link href="/" className="border border-gray-200 pr-4">
      <Image src={full_logo} width={100} alt="logo" />
    </Link>
  );
};

export default Logo;
