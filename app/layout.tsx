// @ts-ignore: missing CSS module type declarations
import './globals.css';

import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mission Tracker - Assane Diallo',
  description: 'Track my Air Force mission plan',
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
