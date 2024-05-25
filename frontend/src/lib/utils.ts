import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { Icons, type Icon } from "@/components/icons";

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
  icon: Icon;
}

export interface SharedProps extends TabContextType {
  user: User;
}

export const Tabs: { [key: string]: Tab } = {
  CHAT: {
    id: "chat",
    title: "Chat",
    icon: Icons.chat,
  },
  LIBRARY: {
    id: "library",
    title: "Knowledge Base",
    icon: Icons.library,
  },
  PROMPTS: {
    id: "prompts",
    title: "Prompts",
    icon: Icons.prompts,
  },
  HELP: {
    id: "help",
    title: "Help",
    icon: Icons.help,
  },
  SETTINGS: {
    id: "settings",
    title: "Settings",
    icon: Icons.settings,
  },
};
