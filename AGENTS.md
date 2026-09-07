# Repository Guidelines

## Project Structure & Module Organization

This event website uses Next.js 15 App Router, React 19, and strict TypeScript.
- `src/app/[locale]/`: Spanish and English pages; `src/app/api/`: registration and photo-upload endpoints.
- `src/components/`: shared layout, sections, and UI components.
- `src/features/`: registration, loader, hero effects, and transitions. Import features through their `index.ts` public APIs.
- `src/i18n/` and `src/config/`: translations and event content; update both language dictionaries when changing copy.
- `src/styles/`: global styles and design tokens; `src/lib/` and `src/hooks/`: shared utilities.
- `public/`: served assets; `_assets-src/`: originals; `prisma/`: schema, migrations, and seed; `scripts/`: maintenance and visual checks.

## Build, Test, and Development Commands

Copy `.env.example` to `.env` and configure the required services before installation.
- `npm ci`: install locked dependencies and generate the Prisma client through `postinstall`.
- `npm run dev`: start local development at `http://localhost:3000`.
- `npm run build` / `npm start`: build and serve production output.
- `npm run typecheck`: check TypeScript without emitting files.
- `npm run lint`: run Next.js ESLint checks.
- `npm run db:seed` / `npm run db:studio`: populate the configured database or inspect it.

## Coding Style & Naming Conventions

Use two-space indentation, single-quoted TypeScript strings, and semicolons. Name components `PascalCase.tsx`, colocate `Component.module.css`, and name hooks `useSomething.ts`. Use `@/*` imports. ESLint extends Next.js Core Web Vitals and TypeScript rules; no formatter is configured.

Use CSS Modules and `src/styles/tokens.css` for colors, typography, and spacing. Add `'use client'` only where needed. Use GSAP for continuous interpolation and Framer Motion for component entrances/exits. Use seeded visual randomness and respect reduced-motion preferences.

## Testing Guidelines

No automated test suite, test naming convention, or coverage threshold is configured. Run lint, typecheck, and build before submitting. Manually verify affected routes, both locales/themes, mobile layouts, keyboard access, and registration behavior.

For timed animation screenshots, use `node scripts/capture.js http://localhost:3000/es ./tmp 800,3000,6500 1280x832`; it requires Chrome at the Windows path configured in the script.

## Commit & Pull Request Guidelines

History uses short, informal Spanish descriptions such as `registro con prisma`; no enforced prefix convention exists. Write focused, descriptive commits. PRs should explain behavior changes, link relevant issues, report validation, and include screenshots for UI changes.

## Security & Configuration

Keep `.env` credentials private and Prisma/R2 helpers server-only. Do not commit generated Prisma output. Use development services for registration checks and document schema or configuration changes.
