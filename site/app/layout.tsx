import type { Metadata, Viewport } from "next";
import { Raleway } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CtaBand from "@/components/CtaBand";
import "./globals.css";

const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Applied Bell Curve — From spreadsheet to executable schedule",
    template: "%s · Applied Bell Curve",
  },
  description:
    "Planning and scheduling software for manufacturers. Your constraints, stated once and enforced — resolved into a schedule your plant can run today.",
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
