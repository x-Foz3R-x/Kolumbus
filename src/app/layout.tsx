import { inter, gordita, adso, inconsolata } from "../assets/fonts/fonts";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
import "./tailwind.css";

export const metadata = {
  title: {
    default: "Kolumbus",
    template: "%s | Kolumbus",
  },
  description: "Trip planning app | Adventure awaits",
  openGraph: {
    title: "Kolumbus",
    description: "TOP 1 trip planning app",
    url: "https://kolumbus.app",
    siteName: "Kolumbus",
    type: "website",
  },
};

type RootLayoutProps = { children: React.ReactNode };

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`scroll-smooth fill-gray-900 text-gray-900 antialiased ${gordita.className} ${gordita.variable} ${adso.variable} ${inter.variable} ${inconsolata.variable}
          `}
        >
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
