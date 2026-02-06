import type { Metadata } from "next";
import { Montserrat, Shrikhand } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import ClientLayout from "./ClientLayout";

const montserrat = Montserrat({
  variable: "--font-paragraph",
  subsets: ["latin"],
});
const shrikhand = Shrikhand({
  weight: "400",
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Community Cares",
  description: "Building communities that care.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${montserrat.variable} ${shrikhand.variable} h-full`}>
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
