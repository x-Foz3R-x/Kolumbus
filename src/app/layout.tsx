import "~/styles/globals.css";

import { Inter, Inconsolata, Belanosima } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "~/lib/utils";

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

export const metadata = {
  title: "Kolumbus",
  description:
    "Travel Planning Made Simple and Fun! Discover the power of Kolumbus and transform your travel planning process. Build your itinerary, navigate your journey with map, manage your travel expenses, and organize your packing list. Your next adventure is just a few clicks away. Start your adventure with Kolumbus today.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            inter.variable,
            belanosima.variable,
            inconsolata.variable,
          )}
        >
          <div className="font-inter min-h-screen scroll-smooth fill-gray-900 text-gray-900 antialiased">
            {props.children}
          </div>

          <SpeedInsights debug={false} />
        </body>
      </html>
    </ClerkProvider>
  );
}
