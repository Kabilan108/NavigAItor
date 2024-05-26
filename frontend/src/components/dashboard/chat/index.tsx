import { useState } from "react";

import { Conversation } from "@/components/dashboard/chat/conversation";
import HideablePanel from "@/components/dashboard/hideable-panel";
import MessageBox from "@/components/dashboard/chat/message-box";
import ChatOptions from "@/components/dashboard/chat/options";
import Drawer from "@/components/dashboard/drawer";

import { type Message as MessageType, Role } from "@/client/generated";
import { type SharedProps } from "@/lib/utils";

interface Props extends SharedProps {}

const RightPanel = () => <HideablePanel children={<ChatOptions />} />;

export const ChatDrawer = () => <Drawer children={<ChatOptions />} />;

export function Chat(props: Props) {
  console.log(props);
  const [conversation, addMessage] = useState<MessageType[]>([]);

  const handleSendMessage = async (userMessage: MessageType) => {
    console.log(`user said '${userMessage.content}'`);
    addMessage([...conversation, userMessage]);
    // TODO: Send message to API, parse response

    const assistantMessage = {
      role: Role.ASSISTANT,
      content: "Hello, I'm an **AI assistant**. How can I help you today?",
    };
    addMessage([...conversation, userMessage, assistantMessage]);
  };

  return (
    <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted p-4 lg:col-span-2">
        <Conversation messages={conversation} />
        <MessageBox onSend={handleSendMessage} />
      </div>
      <RightPanel />
    </main>
  );
}
