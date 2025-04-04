import loader from "@/images/loaders/logo-loader.png";
import Image from "next/image";
import React from "react";

export const Loader = () => {
  return (
    <div className="animate-spin ">
      <div className="animate-pulse">
        <Image src={loader} alt="loader" className="w-16 h-16" />
      </div>
    </div>
  );
};
