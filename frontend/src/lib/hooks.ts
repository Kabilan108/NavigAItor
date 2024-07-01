import { useContext } from "react";

import { ThemeProviderContext } from "@/context/theme-provider";
import { TabContext } from "@/context/tab-provider";
import { AuthContext } from "@/context/auth-provider";

export const useAuth = () => useContext(AuthContext);

export const useTabs = () => useContext(TabContext);

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
