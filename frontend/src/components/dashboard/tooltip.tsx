import {
  Tooltip as BaseTooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import * as Icons from "@/components/icons";

interface Props {
  type: "attach" | "delete";
  onClick: (event: React.MouseEvent) => void;
}

export default function Tooltip({ type, onClick }: Props) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onClick(event);
  };

  let tooltip: {
    icon: React.ReactNode;
    text: string;
  };

  if (type === "attach") {
    tooltip = {
      icon: <Icons.AttachFile className="size-4" />,
      text: "Attach file",
    };
  } else if (type === "delete") {
    tooltip = {
      icon: <Icons.Delete className="size-4" />,
      text: "Delete",
    };
  } else {
    throw new Error("Invalid tooltip type");
  }

  return (
    <BaseTooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" onClick={handleClick}>
          {tooltip.icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={5}>
        {tooltip.text}
      </TooltipContent>
    </BaseTooltip>
  );
}
