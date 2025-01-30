"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "../app/styles/nprogress.css";

export default function NProgressHandler() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (isNavigating) {
      // Ensure the bar starts progressing
      NProgress.start();
    }

    const timeout = setTimeout(() => {
      if (isNavigating) {
        NProgress.inc(0.3); // Simulate progress
      }
    }, 300); // Slight delay for better UX

    return () => clearTimeout(timeout);
  }, [isNavigating]);

  useEffect(() => {
    // Start progress on navigation start
    setIsNavigating(true);

    // Complete progress after pathname change
    const timer = setTimeout(() => {
      setIsNavigating(false);
      NProgress.done();
    }, 500); // Add delay to let NProgress complete visually

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
