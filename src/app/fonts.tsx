import { Inter, Roboto_Mono, Inconsolata } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({
  subsets: ["latin", "greek", "cyrillic"],
  variable: "--font-inter",
});

export const roboto_mono = Roboto_Mono({
  subsets: ["latin", "greek", "cyrillic"],
  variable: "--font-roboto-mono",
});

export const inconsolata = Inconsolata({
  subsets: ["latin"],
  variable: "--font-inconsolata",
});

export const gordita = localFont({
  src: [
    {
      path: "../assets/fonts/gordita/Gordita-Light.woff2",
      weight: "300",
    },
    {
      path: "../assets/fonts/gordita/Gordita-Regular.woff2",
      weight: "400",
    },
    {
      path: "../assets/fonts/gordita/Gordita-Medium.woff2",
      weight: "500",
    },
    {
      path: "../assets/fonts/gordita/Gordita-Bold.woff2",
      weight: "700",
    },
  ],
  variable: "--font-gordita",
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
