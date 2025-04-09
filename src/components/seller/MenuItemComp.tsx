"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface ItemProps {
  title: string;
  items: {
    icon: React.ReactNode;
    label: string;
    href: string;
  }[];
}

const MenuItemComp: React.FC<ItemProps> = ({ title, items }) => {
  const pathname = usePathname();
  // console.log(pathname);
  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted-foreground font-light my-4">{title}</span>
      {items.map((item) => {
        return (
          <Link
            href={item.href}
            key={item.label}
            className={`flex items-center ${pathname === item.href ? "bg-primary-foreground/10" : ""} justify-start gap-2 text-primary-foreground/80 p-3 rounded-md hover:bg-primary-foreground/10 transition-colors duration-200 ease-in-out`}
          >
            {item.icon}
            <span className="">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default MenuItemComp;
