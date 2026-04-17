# Rub & Scrub Mobile Valeting

Phase 1 sets up the foundation for a mobile-first Next.js app that will grow into a public booking site and a future admin area.

## Structure

- `app/` - App Router entry points for the public site and admin area
- `components/` - Reusable UI building blocks
- `lib/` - Shared configuration and Supabase helpers
- `types/` - Shared TypeScript types
- `public/` - Static assets

## Setup

1. Copy `.env.example` to `.env.local`
2. Fill in the Supabase environment variables
3. Run `npm install`
4. Run `npm run dev`

## Site Settings

- `site_settings` is a singleton Supabase table for the WhatsApp number, notification email, and review path.
- Edit the WhatsApp number and notification email from `/admin`.
- Copy the public review link from `/admin` when needed.
- The public site reads the current values server-side on each request.

## Booking Email

- Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` for booking acknowledgement emails.
- Set the internal notification email in `/admin`.

## Scripts

- `npm run dev` - Start the local development server
- `npm run build` - Create a production build
- `npm run start` - Run the production build locally
- `npm run typecheck` - Run the TypeScript compiler

## Notes

- The homepage is public-facing and the admin page is intentionally minimal.
- Supabase helpers are used for server-side settings, reviews, and booking acknowledgements.
- `SUPABASE_SERVICE_ROLE_KEY` is required for the server-side admin/settings flow.
- Booking acknowledgements are sent through Resend and are not confirmation emails.
