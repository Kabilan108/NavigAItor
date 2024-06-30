import { useRef, useEffect } from "react";

import Markdown from "@/components/dashboard/chat/markdown";
import * as Icons from "@/components/icons";

import { type Message as MessageType, Role } from "@/client/generated";
import { cn } from "@/lib/utils";

interface Props {
  messages: MessageType[];
}

export function Message({ message }: { message: MessageType }) {
  if (message.role === Role.SYSTEM) {
    return <></>;
  } else {
    const isUser = message.role === Role.USER;
    return (
      <div
        className={cn(
          "flex items-center space-x-4",
          isUser ? "justify-end" : "justify-start",
        )}
      >
        {isUser ? null : <Icons.Bot className="size-7 hidden" />}
        <div
          className={cn(
            "p-4 rounded-lg inline-block max-w-[80%]",
            isUser ? "bg-primary self-end" : "bg-secondary self-start",
          )}
        >
          <Markdown content={message.content} />
        </div>
        {isUser ? <Icons.User className="size-7 hidden" /> : null}
      </div>
    );
  }
}

export function Conversation({ messages }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-1">
      <div
        ref={containerRef}
        className="flex flex-col gap-4 overflow-y-auto h-[calc(100vh-300px)] pr-2"
      >
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </div>
    </div>
  );
}
