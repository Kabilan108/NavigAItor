import { useState } from "react";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import * as Icons from "@/components/icons";

import { type Message as MessageType, Role } from "@/client/generated";
import Tooltip from "@/components/dashboard/tooltip";
import { DocumentType } from "@/client/types";
import { uploadDocument } from "@/client";

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

  const handleAttachFile = async (event: React.MouseEvent) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf";
    fileInput.multiple = false;

    fileInput.onchange = async (event) => {
      const file = fileInput?.files?.[0];
      if (file) {
        console.log("Uploading file:", file);
        try {
          const metadata = {
            name: file.name,
            document_type: DocumentType.SLIDES,
            tags: ["inconversation"],
          };
          const response = await uploadDocument(file, metadata);
          console.log("Response:", response);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    };
    fileInput.click();
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
        <Tooltip type="attach" onClick={handleAttachFile} />
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
