import { Inter, Inconsolata, Belanosima } from "next/font/google";
import localFont from "next/font/local";

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

export const adso = localFont({
  src: [
    {
      path: "../assets/fonts/adso/Adso-Regular.woff2",
      weight: "400",
    },
    {
      path: "../assets/fonts/adso/Adso-Medium.woff2",
      weight: "500",
    },
    {
      path: "../assets/fonts/adso/Adso-SemiBold.woff2",
      weight: "600",
    },
    {
      path: "../assets/fonts/adso/Adso-Bold.woff2",
      weight: "700",
    },
  ],
  variable: "--font-adso",
});
