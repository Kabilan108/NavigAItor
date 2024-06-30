import { useState } from "react";

import { Conversation } from "@/components/dashboard/chat/conversation";
import HideablePanel from "@/components/dashboard/hideable-panel";
import MessageBox from "@/components/dashboard/chat/message-box";
import ChatOptions from "@/components/dashboard/chat/options";
import Drawer from "@/components/dashboard/drawer";
import { useChatContext } from "@/context/chat-provider";

import { type Message_Input as MessageType, Role } from "@/client/generated";
import { type SharedProps } from "@/lib/utils";
import { sendChatMessage } from "@/client";
import { Chunk } from "@/client/types";

interface Props extends SharedProps {}

interface AssistantMessage {
  role: Role;
  content: string;
  sources?: Chunk[];
}

const RightPanel = () => <HideablePanel children={<ChatOptions />} />;

export const ChatDrawer = () => <Drawer children={<ChatOptions />} />;

export function Chat(props: Props) {
  const first_message = {
    role: Role.ASSISTANT,
    content:
      "Hello, I'm **Navigaitor**, your personal study assistant. How can I help you today?",
  };

  const [messages, addMessage] = useState<(MessageType | AssistantMessage)[]>([
    first_message,
  ]);
  const { setSources } = useChatContext();

  const handleSendMessage = async (userMessage: MessageType) => {
    addMessage([...messages, userMessage]);
    const chat_history = messages.slice(1).concat(userMessage);

    try {
      console.log(chat_history);
      const response = await sendChatMessage(chat_history);
      console.log(response);

      if (response.sources) {
        console.log(response.sources);
        setSources(response.sources);
      }

      addMessage([...messages, userMessage, response]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted p-4 lg:col-span-2">
        <Conversation messages={messages} />
        <MessageBox onSend={handleSendMessage} />
      </div>
      <RightPanel />
    </main>
  );
}
