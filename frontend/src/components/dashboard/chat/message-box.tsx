import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import * as Icons from "@/components/icons";

import AttachFileTooltip from "@/components/dashboard/chat/attach-file-tooltip";
import { handleAttachFile } from "@/lib/chat";

export default function MessageBox() {
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
      />
      <div className="flex items-center p-3 pt-0">
        <AttachFileTooltip onClick={handleAttachFile} />
        <Button type="submit" size="sm" className="ml-auto gap-1.5 bg-white">
          Send Message
          <Icons.Send className="size-3.5" />
        </Button>
      </div>
    </form>
  );
}
