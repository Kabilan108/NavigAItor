import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import * as Icons from "@/components/icons";

import { TabContextType } from "@/context/tab-provider";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface User {
  id: string;
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  created_at: string;
  last_login: string;
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
