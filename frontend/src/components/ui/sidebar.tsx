import SidebarTooltip from "@/components/ui/sidebar-tooltip";
import ModeToggle from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

import { type SharedProps, Tabs } from "@/lib/utils";

interface Props extends SharedProps {}

export default function Sidebar(props: Props) {
  return (
    <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
      <div className="border-b p-2">
        <Button variant="outline" size="icon" aria-label="Home">
          <Icons.logo className="size-5 fill-foreground" />
        </Button>
      </div>
      <nav className="grid gap-1 p-2">
        {Object.values(Tabs).map((tab) => {
          if (tab !== Tabs.SETTINGS) {
            return <SidebarTooltip tab={tab} {...props} />;
          }
        })}
      </nav>
      <nav className="mt-auto grid gap-1 p-2">
        <SidebarTooltip tab={Tabs.SETTINGS} {...props} />
        <ModeToggle />
      </nav>
    </aside>
  );
}
