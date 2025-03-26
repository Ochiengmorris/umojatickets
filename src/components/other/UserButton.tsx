"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth, UserButton, useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import Image from "next/image";

const DropButton = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { setTheme } = useTheme();

  if (!user) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center gap-2">
          <Image
            className="rounded-full"
            width={32}
            height={32}
            src={user.imageUrl}
            alt={user.firstName || ""}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-42 -translate-x-14">
        <DropdownMenuItem className={cn("justify-center")}>
          <UserButton />
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className={cn("justify-center")}
              >
                Light
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className={cn("justify-center")}
              >
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("system")}
                className={cn("justify-center")}
              >
                System
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem onClick={async () => await signOut()}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default DropButton;
