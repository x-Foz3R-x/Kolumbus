import * as Sentry from "@sentry/nextjs";

export function register() {
  Sentry.init({
    dsn: "https://7a8713b9f41e8c19576d76e5d660845d@o4507095547248640.ingest.de.sentry.io/4507095565598800",

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 0.1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
  });
}
