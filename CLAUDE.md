# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

**UseDevTools** is a developer tools discovery platform built with Next.js 16 (App Router), Prisma 7, and Tailwind CSS 4.

### Key Patterns

- **Server-First:** Prefer Server Components and Server Actions over client-side data fetching.
- **Data Access Layer:** All DB queries live in `src/data/`. Never query Prisma directly from components.
- **Server Actions:** Mutations go in `src/actions/`. They use Zod schemas from `src/validations/` for validation.
- **Auth:** Better Auth (`src/lib/auth.ts` server, `src/lib/auth-client.ts` client) with Google/GitHub OAuth. Protected routes are under `src/app/(protected)/`.

### Route Structure

```
src/app/
├── (protected)/          # Requires auth (dashboard, new-tool)
├── api/auth/[...all]/    # Better Auth catch-all
├── explore/              # Tool discovery (public)
├── tool/[id]/            # Tool detail page (public)
└── page.tsx              # Homepage
```

### Environment Variables

Required in `.env`:

- `DATABASE_URL` — Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`

### Styling

- Tailwind CSS 4 (PostCSS plugin, not CLI)
- Dark mode is on by default (`dark` class on `<html>`)
- Prettier uses **tabs**, print width 100, trailing commas (`all`)
- Shadcn UI components are in `src/components/ui/`
