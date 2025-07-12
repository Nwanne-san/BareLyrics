import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bare Lyrics",
  description: "Discover and view your favorite song lyrics",
  icons: {
    icon: "/logo-low.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
