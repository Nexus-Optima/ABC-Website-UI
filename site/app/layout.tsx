import type { Metadata, Viewport } from "next";
import { Raleway } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CtaBand from "@/components/CtaBand";
import "./globals.css";

const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Applied Bell Curve - Every order, every machine, every minute. Planned.",
    template: "%s · Applied Bell Curve",
  },
  description:
    "Advanced Planning & Scheduling for manufacturers. Every order, every machine, every minute. Planned.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={raleway.variable}>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons&display=block" />
      </head>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <CtaBand />
        <SiteFooter />
      </body>
    </html>
  );
}
