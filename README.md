# Kolumbus

## Travel Planning made Simple and Fun!

[Try the demo](https://www.kolumbus.app/#demo)

## TODO

- [x] Update authentication (w/ Clerk)
- [x] Add image upload (w/ UploadThing)
- [x] Error management (w/ Sentry)
- [x] Analytics (PostHog)
- [x] Rate limiting (Upstash)
- [ ] Transfer kolumbus code

## Showcase

On the `kolumbus-showcase` branch, run `pnpm dev` (or `pnpm dev:showcase`) for the
homepage, interactive itinerary demo, and contact page at `http://localhost:3000`.
`pnpm dev:app` selects the original app entry points when needed.
`pnpm build:showcase` exports the same pages to `out/`, which Vercel serves as a static site.
The showcase builds without an `.env` file. Set `GOOGLE_KEY` in Vercel for the demo's
Google Places search, details, and photos. Its serverless API uses this key independently
of Supabase and Clerk. Custom places remain available when Google cannot be reached.

The demo opens an example trip on a first visit and the local trip library on later visits.
Trip edits and explored activities are stored in this browser. The trip toolbar contains
the calendar, undo/redo controls, and history for the current editing session.
The demo reuses the app's trip cards, creation dialog, date picker and toolbar.
It supports up to 6 trips, 14 days and 100 places per trip. The tutorial window can
be closed and reopened from the button above the demo.

The homepage also includes an interactive archive of the original app screens and sketches.
See [the complete showcase change list](docs/showcase-changes.md) for the implementation scope
and the source of each image.
