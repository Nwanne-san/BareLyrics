import "./globals.css";
import type { Metadata } from "next";
import { ClientProviders } from "./client-provider";

export const metadata: Metadata = {
  title: "Bare Lyrics",
  description: "Discover and view your favorite song lyrics",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
