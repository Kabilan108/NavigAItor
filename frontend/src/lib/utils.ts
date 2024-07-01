import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import * as Icons from "@/components/icons";

import { TabContextType } from "@/context/tab-provider";
import type { User } from "@/client/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Tab {
  id: string;
  title: string;
  icon: Icons.Icon;
}

export interface SharedProps extends TabContextType {
  user: User;
}

export const Tabs: { [key: string]: Tab } = {
  CHAT: {
    id: "chat",
    title: "Chat",
    icon: Icons.Chat,
  },
  KNOWLEDGE_BASE: {
    id: "knowledge-base",
    title: "Knowledge Base",
    icon: Icons.Library,
  },
  PROMPTS: {
    id: "prompts",
    title: "Prompts",
    icon: Icons.Prompts,
  },
  HELP: {
    id: "help",
    title: "Help",
    icon: Icons.Help,
  },
  SETTINGS: {
    id: "settings",
    title: "Settings",
    icon: Icons.Settings,
  },
};
