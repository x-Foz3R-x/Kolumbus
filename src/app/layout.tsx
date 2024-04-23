import "~/styles/globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter, Inconsolata, Belanosima } from "next/font/google";
import type { Metadata } from "next/types";

import { absoluteUrl, cn } from "~/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { CSPostHogProvider } from "./_analytics/provider";
import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/toast";
import { siteConfig } from "~/config/site";

export const inter = Inter({
  subsets: ["latin", "greek", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});
export const inconsolata = Inconsolata({
  subsets: ["latin"],
  variable: "--font-inconsolata",
  display: "swap",
});
export const belanosima = Belanosima({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-belanosima",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "nextjs",
    "react",
    "react server components",
    "skateshop",
    "skateboarding",
    "kickflip",
  ],
  creator: "Foz3R",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  manifest: absoluteUrl("/site.webmanifest"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <CSPostHogProvider>
        <html lang="en">
          <body className={cn(inter.variable, belanosima.variable, inconsolata.variable)}>
            <div className="min-h-screen scroll-smooth text-pretty fill-gray-800 font-inter text-gray-800 antialiased">
              <TRPCReactProvider>{children}</TRPCReactProvider>
            </div>

            <Toaster />
            <SpeedInsights debug={false} />
          </body>
        </html>
      </CSPostHogProvider>
    </ClerkProvider>
  );
}
