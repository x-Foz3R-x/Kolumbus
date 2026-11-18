import { withSentryConfig } from "@sentry/nextjs";

const showcase = process.env.NEXT_PUBLIC_KOLUMBUS_SHOWCASE === "1";

if (!showcase) await import("./src/env.js");

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    instrumentationHook: true,
  },
  images: {
    remotePatterns: [
      { hostname: "utfs.io" },
      { hostname: "img.clerk.com" },
      { hostname: "maps.googleapis.com" },
    ],
  },
};

/** @type {import("next").NextConfig} */
const config = showcase
  ? {
      reactStrictMode: false,
      ...(process.env.NODE_ENV === "production" ? { output: "export" } : {}),
      pageExtensions: [
        "showcase.tsx",
        "showcase.ts",
        ...(process.env.NODE_ENV === "development" ? ["showcase.dev.ts"] : []),
      ],
      images: { unoptimized: true },
    }
  : withSentryConfig(nextConfig, {
      org: "kolumbus-v9",
      project: "kolumbus",
      silent: true,
      widenClientFileUpload: true,
      tunnelRoute: "/monitoring",
      hideSourceMaps: true,
      disableLogger: true,
      automaticVercelMonitors: true,
    });

export default config;
