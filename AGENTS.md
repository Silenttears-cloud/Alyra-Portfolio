# Portfolio — Agent Guidelines

This is a standalone TanStack Start + Vite portfolio project. It is **not** connected to any external hosted editor.

## Key Architecture
- **Framework**: TanStack Start (SSR) + Vite 8 + React 19
- **Styling**: Tailwind CSS v4 + custom CSS variables in `src/styles.css`
- **3D**: Three.js via `@react-three/fiber` and `@react-three/drei`
- **Routing**: TanStack Router with file-based routes in `src/routes/`

## Profile Image
The profile photo is stored at `public/images/ayushi.webp` and referenced
directly via the `/images/ayushi.webp` public path in `src/sections/Identity.tsx`.
To update the photo, replace the file at that path.

## Error Reporting
Generic error reporting lives in `src/lib/error-reporting.ts`.
Wire `reportError` to a monitoring service (e.g. Sentry) in production.
