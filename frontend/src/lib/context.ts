import { useContext } from "react";
import { AuthContext } from "@/context/auth-provider";
import { ThemeProviderContext } from "@/context/theme-provider";

export const useAuth = () => useContext(AuthContext);

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
