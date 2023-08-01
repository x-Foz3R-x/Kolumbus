import localFont from "@next/font/local";

export const inter = localFont({
  src: "./Inter-Variable.woff2",
  variable: "--font-inter",
});

export const inconsolata = localFont({
  src: "./Inconsolata-Variable.woff2",
  variable: "--font-inconsolata",
});

export const gordita = localFont({
  src: [
    {
      path: "./gordita/Gordita-Light.woff2",
      weight: "300",
    },
    {
      path: "./gordita/Gordita-Regular.woff2",
      weight: "400",
    },
    {
      path: "./gordita/Gordita-Medium.woff2",
      weight: "500",
    },
    {
      path: "./gordita/Gordita-Bold.woff2",
      weight: "700",
    },
  ],
  variable: "--font-gordita",
});

export const adso = localFont({
  src: [
    {
      path: "./adso/Adso-Regular.woff2",
      weight: "400",
    },
    {
      path: "./adso/Adso-Medium.woff2",
      weight: "500",
    },
    {
      path: "./adso/Adso-SemiBold.woff2",
      weight: "600",
    },
    {
      path: "./adso/Adso-Bold.woff2",
      weight: "700",
    },
  ],
  variable: "--font-adso",
});
