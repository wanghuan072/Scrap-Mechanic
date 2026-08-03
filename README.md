# Scrap Mechanic Field Guide

Next.js site for Scrap Mechanic guides, wiki entries, builds, tools, updates, and legal information.

## Project structure

```text
src/
├─ app/          Next.js route entry files and framework files
├─ page/         Complete page implementations grouped by site area
├─ components/   Components shared by multiple page areas
├─ style/        Global and page-owned styles
├─ data/         Pure local JSON collections only
├─ types/        Shared TypeScript data contracts
├─ lib/          Data loaders, queries, calculations, and formatters
├─ config/       Site-wide configuration and navigation
└─ seo/          Metadata, fixed TDK, and structured-data helpers

scripts/
├─ audit/        SEO and rendered-output checks
└─ data/         Local game-data extraction and generation tools
```

### Directory boundaries

- `src/app` stays thin. A route file delegates rendering to its matching implementation in `src/page`.
- `src/page/legal` owns the legal page implementations, while their public routes remain `/about`, `/contact`, `/copyright`, `/privacy-policy`, and `/terms-of-service`.
- `src/data` contains JSON only. Each file represents a logical collection, including all detail records and their per-record SEO fields.
- Runtime behavior does not belong in `src/data`; loaders and queries live in `src/lib`, and reusable contracts live in `src/types`.
- Styles mirror the page area under `src/style/page` without changing the existing class names.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run audit:seo
npm run audit:rendered
```
