import { Analytics } from "@vercel/analytics/react";
import { inter, gordita, adso, inconsolata } from "../assets/fonts/fonts";
import { ClerkProvider } from "@clerk/nextjs";
import TrpcProvider from "./_trpc/Provider";
import "./tailwind.css";

export const metadata = {
  title: {
    default: "Kolumbus",
  },
  description:
    "Discover the ultimate travel experience with our Trip Planning App. Craft personalized itineraries effortlessly. Seamlessly plan your adventures and explore the world like never before.",
};

type RootLayoutProps = { children: React.ReactNode };

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      {/* <html lang="en" style={{ fontSize: "16px" }} className="dark"> */}
      <html lang="en" style={{ fontSize: "16px" }}>
        <body
          className={`h-screen w-screen scroll-smooth fill-gray-900 text-gray-900 antialiased selection:bg-kolumblue-300 ${gordita.className} ${gordita.variable} ${adso.variable} ${inter.variable} ${inconsolata.variable}
          `}
        >
          <TrpcProvider>{children}</TrpcProvider>
          <Analytics debug={false} />
        </body>
      </html>
    </ClerkProvider>
  );
}
