import SidebarTooltip from "@/components/dashboard/sidebar-tooltip";
import DarkModeToggle from "@/components/ui/dark-mode-toggle";
import { Button } from "@/components/ui/button";
import * as Icons from "@/components/icons";

import { type SharedProps, Tabs } from "@/lib/utils";

interface Props extends SharedProps {}

export default function Sidebar(props: Props) {
  return (
    <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
      <div className="border-b p-2">
        <Button variant="outline" size="icon" aria-label="Home">
          <Icons.Logo className="size-5 fill-foreground" />
        </Button>
      </div>
      <nav className="grid gap-1 p-2">
        {Object.values(Tabs).map((tab, index) => {
          if (tab !== Tabs.SETTINGS) {
            return <SidebarTooltip key={index} tab={tab} {...props} />;
          }
        })}
      </nav>
      <nav className="mt-auto grid gap-1 p-2">
        <DarkModeToggle />
        <SidebarTooltip tab={Tabs.SETTINGS} {...props} />
      </nav>
    </aside>
  );
}
