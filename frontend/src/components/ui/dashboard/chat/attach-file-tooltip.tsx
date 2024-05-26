import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import * as Icons from "@/components/icons";

interface Props {
  onClick: () => void;
}

export default function AttachFileTooltip({ onClick }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" onClick={onClick}>
          <Icons.AttachFile className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={5}>
        Attach file
      </TooltipContent>
    </Tooltip>
  );
}
