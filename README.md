# Kolumbus

## Travel Planning made Simple and Fun!

[Start Your Adventure](https://www.kolumbus.app/sign-up)

## TODO

- [x] Update authentication (w/ Clerk)
- [x] Add image upload (w/ UploadThing)
- [x] Error management (w/ Sentry)
- [x] Analytics (PostHog)
- [x] Rate limiting (Upstash)
- [ ] Transfer kolumbus code

## Showcase

Run `pnpm dev:showcase` for the homepage, interactive itinerary demo, and contact page.
`pnpm build:showcase` exports the same pages to `out/`, which Vercel serves as a static site.
The showcase builds without an `.env` file. Set `GOOGLE_KEY` in Vercel for the demo's
Google Places search, details, and photos. Its serverless API uses this key independently
of Supabase and Clerk. Custom places remain available when Google cannot be reached.

The demo opens an example trip on a first visit and the local trip library on later visits.
Trip edits and explored activities are stored in this browser. The trip toolbar contains
the calendar, undo/redo controls, and history for the current editing session.
