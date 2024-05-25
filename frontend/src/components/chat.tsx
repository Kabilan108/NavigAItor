import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import AttachFileTooltip from "@/components/ui/chat/attach-file-tooltip";
import ChatSettings from "@/components/ui/chat/settings";

import { type SharedProps } from "@/lib/utils";
import { Icons } from "@/components/icons";

interface Props extends SharedProps {}

export function ChatDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden ml-2">
          <Icons.settings className="size-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle>Chat Settings</DrawerTitle>
          <DrawerDescription>
            Configure the settings for the model and messages.
          </DrawerDescription>
        </DrawerHeader>
        <ChatSettings inDrawer />
      </DrawerContent>
    </Drawer>
  );
}

export function Chat(props: Props) {
  function handleAttachFile() {
    console.log("Attach file");
  }

  return (
    <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
        <Badge variant="outline" className="absolute right-3 top-3">
          Output
        </Badge>
        <div className="flex-1" />
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
            <Button type="submit" size="sm" className="ml-auto gap-1.5">
              Send Message
              <Icons.send className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
      <div
        className="relative hidden flex-col items-start gap-8 md:flex"
        x-chunk="dashboard-03-chunk-0"
      >
        <ChatSettings />
      </div>
    </main>
  );
}
