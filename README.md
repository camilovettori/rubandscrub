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

## Scripts

- `npm run dev` - Start the local development server
- `npm run build` - Create a production build
- `npm run start` - Run the production build locally
- `npm run typecheck` - Run the TypeScript compiler

## Notes

- The homepage and admin page are placeholders only.
- Booking logic, calendar logic, and authentication will be added in later phases.
- Supabase helpers are ready for future client, server, and admin usage.
- `SUPABASE_SERVICE_ROLE_KEY` is optional for now, but it is ready for future admin/server work.
