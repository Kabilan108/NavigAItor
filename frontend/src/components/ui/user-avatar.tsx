import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

import { type SharedProps, Tabs } from "@/lib/utils";

interface Props extends SharedProps {}

export default function UserAvatar({ setActiveTab, user }: Props) {
  const [imageError, setImageError] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="overflow-hidden rounded-full ml-auto gap-1.5"
        >
          {imageError ? (
            <Icons.user className="size-5" />
          ) : (
            <img
              src={user.picture}
              width={36}
              height={36}
              alt={user.given_name}
              onError={() => setImageError(true)}
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="m-2">
        <DropdownMenuLabel>Hi, {user.given_name}!</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => setActiveTab(Tabs.SETTINGS)}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => (window.location.href = "/logout")}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
