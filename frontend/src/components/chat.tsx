import { Conversation } from "@/components/ui/dashboard/chat/conversation";
import MessageBox from "@/components/ui/dashboard/chat/message-box";
import ChatOptions from "@/components/ui/dashboard/chat/options";
import Drawer from "@/components/ui/dashboard/drawer";

import { type SharedProps } from "@/lib/utils";

interface Props extends SharedProps {}

export function ChatDrawer() {
  return (
    <Drawer>
      <ChatOptions />
    </Drawer>
  );
}

function RightPanel() {
  return (
    <div
      className="relative hidden flex-col items-start gap-8 md:flex"
      x-chunk="dashboard-03-chunk-0"
    >
      <ChatOptions />
    </div>
  );
}

export function Chat(props: Props) {
  return (
    <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted p-4 lg:col-span-2">
        <Conversation />
        <MessageBox />
      </div>
      <RightPanel />
    </main>
  );
}
