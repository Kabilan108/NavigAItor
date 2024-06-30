import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useChatContext } from "@/context/chat-provider";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Chunk } from "@/client/types";

interface Props {
  inDrawer?: boolean;
}

interface ImageProps {
  base64: string;
}

export default function ChatOptions({ inDrawer }: Props) {
  const { sources } = useChatContext();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [selectedSource, setSelectedSource] = useState<Chunk | null>(null);

  const handleDialogOpen = (source: Chunk) => {
    setSelectedSource(source);
    setIsOpenDialog(true);
  };

  const Base64Image: React.FC<ImageProps> = ({ base64 }) => {
    return <img src={`data:image/png;base64,${base64}`} alt="Image" />;
  };

  return (
    <div
      className={cn(
        "w-full flex flex-col gap-4 rounded-lg overflow-y-auto p-6",
        inDrawer ? "overflow-auto pt-0" : "",
      )}
    >
      {sources.map((source, index) => (
        <div
          key={index}
          className="p-4 rounded-lg w-full bg-muted-foreground text-center active:bg-popover"
          onClick={() => handleDialogOpen(source)}
        >
          <h3 className="text-500 font-bold">
            {source.document_name.split(".")[0]}
          </h3>
          <p className="text-300">{source.title}</p>
          <Badge className="bg-[#2a9d8f]">#{source.tags[0]}</Badge>
        </div>
      ))}
      <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
        <DialogContent className="overflow-auto max-h-[80%] overflow-y-auto bg-slate-900">
          <DialogHeader>
            <DialogTitle>
              {selectedSource?.document_name.split(".")[0]}
            </DialogTitle>
            <DialogDescription>{selectedSource?.title}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <p className="text-200">{selectedSource?.text}</p>
            {selectedSource?.image && (
              <Base64Image base64={selectedSource?.image} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
