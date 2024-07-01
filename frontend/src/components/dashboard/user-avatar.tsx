import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import * as Icons from "@/components/icons";

import { type SharedProps, Tabs } from "@/lib/utils";

interface Props extends SharedProps {}

export default function UserAvatar({ setActiveTab, user }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="overflow-hidden rounded-full ml-auto gap-1.5"
        >
          <Icons.User className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="m-2">
        <DropdownMenuLabel>Hi User!</DropdownMenuLabel>
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
