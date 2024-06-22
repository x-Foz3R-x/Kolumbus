import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const msg = "You forgot to change environment variables";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    // Database
    DATABASE_URL: z
      .string()
      .url()
      .refine((str) => !str.includes("YOUR_DATABASE_URL"), msg),
    CLERK_SECRET_KEY: z.string().refine((str) => !str.includes("YOUR_SECRET_KEY"), msg),
    // UploadThing
    UPLOADTHING_SECRET: z.string().refine((str) => !str.includes("YOUR_SECRET"), msg),
    UPLOADTHING_APP_ID: z.string().refine((str) => !str.includes("YOUR_APP_ID"), msg),
    // Upstash
    UPSTASH_REDIS_REST_URL: z.string().refine((str) => !str.includes("YOUR_REST_URL"), msg),
    UPSTASH_REDIS_REST_TOKEN: z.string().refine((str) => !str.includes("YOUR_REST_TOKEN"), msg),
    // Google
    GOOGLE_KEY: z.string().refine((str) => !str.includes("YOUR_GOOGLE_KEY"), msg),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string(),
    // Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
      .string()
      .refine((str) => !str.includes("YOUR_PUBLISHABLE_KEY"), msg),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: z.string(),
    // PostHog
    NEXT_PUBLIC_POSTHOG_KEY: z.string().refine((str) => !str.includes("YOUR_POSTHOG_KEY"), msg),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().refine((str) => !str.includes("YOUR_POSTHOG_HOST"), msg),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtime's (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    // Database
    DATABASE_URL: process.env.DATABASE_URL,
    // Clerk
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL:
      process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL:
      process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL,
    // UploadThing
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
    // PostHog
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    // Upstash
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    // Google
    GOOGLE_KEY: process.env.GOOGLE_KEY,
  },

  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
