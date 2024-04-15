import { ClerkProvider } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";

import { cn } from "@/lib/utils";
import { inter, adso, inconsolata, belanosima } from "./fonts";
import TrpcProvider from "./_trpc/Provider";
import "@/css/tailwind.css";

export const metadata: Metadata = {
  title: "Kolumbus",
  applicationName: "Kolumbus",
  category: "Trip planner",
  creator: "Foz3R",
  description:
    "Kolumbus - Travel Planning Made Simple and Fun. Discover the power of Kolumbus and transform your travel planning process. Build your itinerary, navigate your journey with map, manage your travel expenses, and organize your packing list. Your next adventure is just a few clicks away. Start your adventure with Kolumbus today.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" style={{ fontSize: "16px" }}>
        <body
          className={cn(
            "min-h-screen scroll-smooth fill-gray-900 font-inter text-gray-900 antialiased",
            inter.variable,
            adso.variable,
            belanosima.variable,
            inconsolata.variable,
          )}
        >
          <TrpcProvider>{children}</TrpcProvider>

          <SpeedInsights debug={false} />
          <Analytics debug={false} />
        </body>
      </html>
    </ClerkProvider>
  );
}
