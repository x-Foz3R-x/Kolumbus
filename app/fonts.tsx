import localFont from "@next/font/local";

export const inter = localFont({
  src: "../public/fonts/Inter-Variable.woff2",
  variable: "--font-inter",
});

export const gordita = localFont({
  src: [
    {
      path: "../public/fonts/gordita/Gordita-Light.woff2",
      weight: "300",
    },
    {
      path: "../public/fonts/gordita/Gordita-Regular.woff2",
      weight: "400",
    },
    {
      path: "../public/fonts/gordita/Gordita-Medium.woff2",
      weight: "500",
    },
    {
      path: "../public/fonts/gordita/Gordita-Bold.woff2",
      weight: "700",
    },
  ],
  variable: "--font-gordita",
});

export const adso = localFont({
  src: [
    {
      path: "../public/fonts/adso/Adso-ExtraLight.woff2",
      weight: "200",
    },
    {
      path: "../public/fonts/adso/Adso-Light.woff2",
      weight: "300",
    },
    {
      path: "../public/fonts/adso/Adso-Regular.woff2",
      weight: "400",
    },
    {
      path: "../public/fonts/adso/Adso-Medium.woff2",
      weight: "500",
    },
    {
      path: "../public/fonts/adso/Adso-SemiBold.woff2",
      weight: "600",
    },
    {
      path: "../public/fonts/adso/Adso-Bold.woff2",
      weight: "700",
    },
  ],
  variable: "--font-adso",
});
