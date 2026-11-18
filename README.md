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
The showcase runs without an `.env` file.
