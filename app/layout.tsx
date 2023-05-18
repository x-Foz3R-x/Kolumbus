import "./tailwind.css";

import { inter, gordita, adso } from "./fonts";

export const metadata = {
  title: {
    default: "Kolumbus",
    template: "%s | Kolumbus",
  },
  description: "Trip planning app | Adventure awaits",
  openGraph: {
    title: "Kolumbus",
    description: "The TOP 1 trip planning app",
    url: "https://kolumbus.app",
    siteName: "Kolumbus",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={
          gordita.className +
          " " +
          gordita.variable +
          " " +
          adso.variable +
          " " +
          inter.variable +
          " "
        }
      >
        {children}
      </body>
    </html>
  );
}
