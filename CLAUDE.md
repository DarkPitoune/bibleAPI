# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Node.js/Express REST API serving the French Jerusalem Bible translation. Deployed as a Vercel serverless function. All Bible data lives in a static `api/bible.json` file (~5.5MB) loaded into memory at startup — there is no database.

Production URL: `https://bible-api-lovat.vercel.app/`

## Development

- **Package manager:** pnpm
- **Install dependencies:** `pnpm install`
- **No build step, no tests, no linter** — the project has no scripts defined in package.json
- **Local run:** `node api/index.ts` (serves on port 8000). Despite the `.ts` extension, the file uses CommonJS `require()` syntax and runs directly via Node/Vercel without compilation.

## Architecture

### API (`api/index.ts`)

Single Express app exporting for Vercel serverless. Routes:

- `GET /books` — list all books (`[{ abbr, name }]`)
- `GET /books/:abbr` — all chapters and verses for a book
- `GET /books/:abbr/:chapter` — all verses for a chapter
- `GET /books/:abbr/:chapter/:verse` — single verse (direct key lookup, no padding)
- `GET /bible.json` — entire Bible data
- `GET /bible.txt` — plain text (one verse per line)
- `GET /swagger` — Swagger UI docs

Root `/` redirects to `/swagger`.

### Data format (`api/bible.json`)

```json
{
  "books": [
    { "abbr": "Gn", "name": "Livre de la Genèse", "chapters": { "1": { "1": "text", ... } } }
  ]
}
```

- Books: ordered array (canonical order), each with `abbr`, `name`, `chapters`
- Chapters: object with string keys (including `"0"` for prologues, `"9A"`/`"9B"` for split Psalms)
- Verses: object with string keys — unpadded (`"1"`, not `"01"`), non-numeric kept as-is (`"17A"`, `"1b"`, `"3-4"`)

Key edge cases: Psalm chapter splits (`9A`, `9B`, `113A`, `113B`), Esther letter-suffixed verses (`1A`–`1L`, `17A`–`17Z`), chapter/verse `"0"` for prologues/liturgical markers, merged verse `"3-4"` (Tobie 9), sub-verse `"1b"` (Tobie 13), verses ≥ 100 (Ps 118, Dn 3).

### Scraper scripts (`scrapeAELFscripts/`)

One-time scripts that scraped `aelf.org` to build `bible.json`. Not part of the deployed API. The data has since been hand-revised.

### Deployment (`vercel.json`)

All requests are rewritten to `/api`, which maps to `api/index.ts` as a Vercel serverless function.
