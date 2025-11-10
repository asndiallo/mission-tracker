import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mission Tracker - Assane Diallo",
  description: "Track my Air Force mission plan",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mission Tracker",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <div className="min-h-screen bg-slate-50">{children}</div>
      </body>
    </html>
  );
}
