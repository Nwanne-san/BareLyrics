"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { LayoutWrapper } from "@/components/layout-wrapper";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <LayoutWrapper>{children}</LayoutWrapper>
      <Toaster />
    </ThemeProvider>
  );
}
