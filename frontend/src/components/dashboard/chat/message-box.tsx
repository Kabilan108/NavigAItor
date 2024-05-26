import { useState } from "react";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import * as Icons from "@/components/icons";

import AttachFileTooltip from "@/components/dashboard/chat/attach-file-tooltip";
import { type Message as MessageType, Role } from "@/client/generated";
import { handleAttachFile } from "@/lib/chat";

interface Props {
  onSend: (message: MessageType) => void;
}

export default function MessageBox({ onSend }: Props) {
  const [content, setContent] = useState("");

  const handleSumbit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSend({ role: Role.USER, content });
      setContent("");
    }
  };

  return (
    <form
      className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
      x-chunk="dashboard-03-chunk-1"
    >
      <Label htmlFor="message" className="sr-only">
        Message
      </Label>
      <Textarea
        id="message"
        placeholder="Type your message here..."
        className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex items-center p-3 pt-0">
        <AttachFileTooltip onClick={handleAttachFile} />
        <Button
          type="submit"
          size="sm"
          className="ml-auto gap-1.5 bg-white"
          onClick={handleSumbit}
        >
          Send Message
          <Icons.Send className="size-3.5" />
        </Button>
      </div>
    </form>
  );
}
