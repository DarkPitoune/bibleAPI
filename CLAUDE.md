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

Single Express app exporting for Vercel serverless. All routes are under `/book/`:

- `/book/` — list all book names
- `/book/all` — entire Bible JSON
- `/book/:book` — list chapters for a book
- `/book/:book/all` — all verses for a book
- `/book/:book/:chapter/` — list verses for a chapter
- `/book/:book/:chapter/all` — all verses for a chapter
- `/book/:book/:chapter/:verse` — single verse (verse numbers auto-padded to 2 digits)

Root `/` redirects to `/swagger` (Swagger UI docs generated from JSDoc annotations).

### Data format (`api/bible.json`)

Nested JSON: `{ "BookName": { "chapterNum": { "verseNum": "text" } } }`. Verse numbers are zero-padded strings (e.g., `"01"`, `"02"`).

### Scraper scripts (`scrapeAELFscripts/`)

One-time scripts that scraped `aelf.org` to build `bible.json`. Not part of the deployed API. Entry point is `main.js`.

### Deployment (`vercel.json`)

All requests are rewritten to `/api`, which maps to `api/index.ts` as a Vercel serverless function.
