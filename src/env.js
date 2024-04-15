import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_DATABASE_URL"),
        "You forgot to change the database default URL",
      ),
    CLERK_SECRET_KEY: z
      .string()
      .refine(
        (str) => !str.includes("sk_test_YOUR_SECRET_KEY"),
        "You forgot to change the clerk default secret key",
      ),
    UPLOADTHING_SECRET: z
      .string()
      .refine(
        (str) => !str.includes("sk_live_YOUR_SECRET"),
        "You forgot to change the upload thing default secret key",
      ),
    UPLOADTHING_APP_ID: z
      .string()
      .refine(
        (str) => !str.includes("YOUR_APP_ID"),
        "You forgot to change the upload thing default app id",
      ),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
      .string()
      .refine(
        (str) => !str.includes("pk_test_YOUR_PUBLISHABLE_KEY"),
        "You forgot to change the clerk default publishable key",
      ),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtime's (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
    NODE_ENV: process.env.NODE_ENV,
  },
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
