import { ClerkProvider } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { CSPostHogProvider } from "./_analytics/provider";
import RootDocument from "./_components/root-document";

export { metadata } from "./_components/root-document";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <CSPostHogProvider>
        <RootDocument speedInsights={<SpeedInsights debug={false} />}>{children}</RootDocument>
      </CSPostHogProvider>
    </ClerkProvider>
  );
}
