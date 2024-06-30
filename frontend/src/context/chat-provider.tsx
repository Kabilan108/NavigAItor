import React, { createContext, useContext, useState } from "react";
import { Chunk } from "@/client/types";

interface ChatContextType {
  sources: Chunk[];
  setSources: (sources: Chunk[]) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context)
    throw new Error("useChatContext must be used within a ChatContextProvider");
  return context;
};

export const ChatContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sources, setSources] = useState<Chunk[]>([]);
  return (
    <ChatContext.Provider value={{ sources, setSources }}>
      {children}
    </ChatContext.Provider>
  );
};
