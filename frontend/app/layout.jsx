import { Inter as FontSans } from "next/font/google";

import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import { TailwindIndicator } from "@/components/tailwind-indicators";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: {
    default: "NavigAItor",
    template: `%s | NavigAItor`,
  },
  description: "As",
  keywords: ["Study tool", "AI", "LLM", "Multimodal", "Homework"],
  authors: [
    {
      name: "Kabilan108",
      url: "https://kabilan108.github.io",
    },
  ],
  creator: "Kabilan108",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers>
          {children}
          {/* <Analytics />
          <Toaster /> */}
          <TailwindIndicator />
        </Providers>
      </body>
    </html>
  );
}
