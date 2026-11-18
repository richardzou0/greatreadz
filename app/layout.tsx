import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import { AgentationProvider } from "@/components/AgentationProvider";
import { BottomNav, Sidebar } from "@/components/Navigation";
import { ReadingProvider } from "@/components/ReadingProvider";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Greatreadz",
  description:
    "Greatreadz: a calmer feed, half-star ratings, one search, mood-based browsing and a true dark mode. An unsolicited Goodreads redesign concept, not affiliated with Goodreads or Amazon.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f2ea" },
    { media: "(prefers-color-scheme: dark)", color: "#14120f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ReadingProvider>
          <div className="flex min-h-dvh">
            <Sidebar />
            <div className="min-w-0 flex-1 pb-[84px] lg:pb-0">{children}</div>
          </div>
          <BottomNav />
        </ReadingProvider>
        <AgentationProvider />
      </body>
    </html>
  );
}
