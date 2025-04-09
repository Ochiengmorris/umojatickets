import React from "react";
import {
  HomeIcon,
  CalendarIcon,
  TicketIcon,
  UsersIcon,
  BarChart2Icon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  TagIcon,
} from "lucide-react";
import Image from "next/image";
import logo_blue from "@/images/logo/logo-blue.png";
import MenuItemComp from "./MenuItemComp";
import { Button } from "../ui/button";
import { currentUser } from "@clerk/nextjs/server";

const menuItems = [
  {
    title: "DASHBOARD",
    items: [
      {
        icon: <HomeIcon width={20} height={20} className="w-5 h-5 mr-3 " />,
        label: "Overview",
        href: "/admin/overview",
      },
      {
        icon: <CalendarIcon width={20} height={20} className="w-5 h-5 mr-3 " />,
        label: "Events",
        href: "/admin/events",
      },
      {
        icon: <TicketIcon width={20} height={20} className="w-5 h-5 mr-3 " />,
        label: "Tickets",
        href: "/admin/tickets",
      },
      {
        icon: <UsersIcon width={20} height={20} className="w-5 h-5 mr-3 " />,
        label: "Attendees",
        href: "/admin/attendees",
      },
      {
        icon: <TagIcon width={20} height={20} className="w-5 h-5 mr-3 " />,
        label: "Promo Codes",
        href: "/admin/promo-codes",
      },
      {
        icon: (
          <BarChart2Icon width={20} height={20} className="w-5 h-5 mr-3 " />
        ),
        label: "Analytics",
        href: "/admin/analytics",
      },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      {
        icon: <UserIcon width={20} height={20} className="w-5 h-5 mr-3 " />,
        label: "Profile",
        href: "/admin/profile",
      },
      {
        icon: <SettingsIcon width={20} height={20} className="w-5 h-5 mr-3 " />,
        label: "Settings",
        href: "/admin/settings",
      },
    ],
  },
];

const Sidebar = async () => {
  const user = await currentUser();
  return (
    <div className="hidden md:flex md:w-64 lg:w-72 flex-col bg-primary text-primary-foreground fixed inset-y-0">
      {/* Logo */}
      <div className="flex items-center ">
        <Image
          src={logo_blue}
          width={200}
          height={200}
          alt="logo"
          className="object-contain w-[100px] h-[100px] md:w-[140px] md:h-[140px] absolute -top-6"
          priority
        />
      </div>

      {/* Navigation */}
      <nav className="mt-16 px-2 text-sm flex flex-col justify-start gap-4 grow">
        {menuItems.map((section, index) => (
          <MenuItemComp
            key={index}
            title={section.title}
            items={section.items}
          />
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-primary-foreground/10">
        <div className="flex items-center gap-3">
          <img
            src={user?.imageUrl ?? ""}
            alt="User avatar"
            className="h-10 w-10 rounded-full"
          />
          <div>
            <p className="font-medium">{user?.fullName}</p>
            <p className="text-xs text-slate-400">
              {user?.emailAddresses[0].emailAddress}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="mt-3 w-full p-3 flex items-center justify-center gap-2 text-sm text-primary-foreground/80 rounded-md hover:bg-primary-foreground/10 transition-colors duration-200 ease-in-out"
          // Add sign out functionality here
        >
          <LogOutIcon className="h-4 w-4" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
