import { ClerkProvider } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

import { inter, gordita, adso, inconsolata } from "./fonts";
import TrpcProvider from "./_trpc/Provider";
import { Metadata } from "next";
import "./tailwind.css";

import BetaWatermark from "@/components/beta-watermark";

export const metadata: Metadata = {
  title: "Kolumbus",
  applicationName: "Kolumbus",
  category: "Trip planner",
  creator: "Foz3R",
  description:
    "Turn dreams into reality with Kolumbus! 🌟 From dream to itinerary, plan your trips effortlessly and savor the freedom to explore. Your journey, your way - Kolumbus, where adventure begins!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" style={{ fontSize: "16px" }}>
        <body
          className={`h-screen w-screen scroll-smooth fill-gray-900 text-gray-900 antialiased ${gordita.className} ${gordita.variable} ${adso.variable} ${inter.variable} ${inconsolata.variable}
          `}
        >
          <TrpcProvider>
            {children}
            <BetaWatermark />
          </TrpcProvider>

          <SpeedInsights debug={false} />
          <Analytics debug={false} />
        </body>
      </html>
    </ClerkProvider>
  );
}
