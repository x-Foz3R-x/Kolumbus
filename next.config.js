await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      { hostname: "utfs.io" },
      { hostname: "img.clerk.com" },
      { hostname: "maps.googleapis.com" },
    ],
  },
};

export default config;
