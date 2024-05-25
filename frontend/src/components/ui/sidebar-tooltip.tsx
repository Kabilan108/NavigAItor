import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

import { type SharedProps, type Tab, cn } from "@/lib/utils";

interface Props extends SharedProps {
  tab: Tab;
}

export default function SidebarTooltip({
  tab,
  activeTab,
  setActiveTab,
}: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("rounded-lg", activeTab === tab ? "bg-muted" : "")}
          aria-label={tab.title}
          onClick={() => setActiveTab(tab)}
        >
          <tab.icon className="size-6" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={5}>
        {tab.title}
      </TooltipContent>
    </Tooltip>
  );
}
