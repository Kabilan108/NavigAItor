import { createContext, useState, ReactNode } from "react";

import { Tabs, type Tab } from "@/lib/utils";

export interface TabContextType {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const TabContext = createContext<TabContextType>({
  activeTab: Tabs.CHAT,
  setActiveTab: () => {},
});

export function TabProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tab>(Tabs.CHAT);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
}
