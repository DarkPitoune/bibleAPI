# Bible de Jérusalem API

REST API serving the French Jerusalem Bible translation.

**Base URL:** https://bible-api-lovat.vercel.app

**Full docs (Swagger):** https://bible-api-lovat.vercel.app/swagger

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/books` | List all books (`abbr` + `name`) |
| GET | `/books/:abbr` | All chapters & verses for a book |
| GET | `/books/:abbr/:chapter` | All verses for a chapter |
| GET | `/books/:abbr/:chapter/:verse` | Single verse |
| GET | `/bible.json` | Entire Bible as JSON |
| GET | `/bible.txt` | Entire Bible as plain text |

## Usage note

For reliable, offline-capable access, prefer fetching `/bible.json` once and serving it locally rather than calling individual endpoints repeatedly.

## Quick examples

```
GET /books/Gn/1/1      → Genesis 1:1
GET /books/Ps/9A/1     → Psalm 9A, verse 1
GET /books/Est/4/17A   → Esther 4:17A (deuterocanonical)
```
