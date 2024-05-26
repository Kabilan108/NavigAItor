import { useRef, useEffect } from "react";

import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import SyntaxHighlighter from "react-syntax-highlighter";
import Markdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";

import * as Icons from "@/components/icons";

import { type Message as MessageType, Role } from "@/client/generated";
import { cn } from "@/lib/utils";

interface Props {
  messages: MessageType[];
}

function MdRender({ markdown }: { markdown: string }) {
  return (
    <Markdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex]}
      children={markdown}
      components={{
        code(props) {
          const { children, className, ref, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <SyntaxHighlighter
              {...rest}
              PreTag="div"
              children={String(children).replace(/\n$/, "")}
              language={match[1]}
              style={docco}
            />
          ) : (
            <code {...rest} className={className} ref={ref}>
              {children}
            </code>
          );
        },
      }}
    />
  );
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
        {isUser ? null : <Icons.Bot className="size-7" />}
        <div
          className={cn(
            "p-4 rounded-lg inline-block max-w-[80%]",
            isUser ? "bg-primary self-end" : "bg-secondary self-start",
          )}
        >
          <MdRender markdown={message.content} />
        </div>
        {isUser ? <Icons.User className="size-7" /> : null}
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
        className="flex flex-col gap-4 overflow-y-auto h-[calc(100vh-250px)] pr-2"
      >
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </div>
    </div>
  );
}
