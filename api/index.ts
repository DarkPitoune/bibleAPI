const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());

const bibleData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "bible.json"), "utf-8")
);

const bookByAbbr = {};
for (const book of bibleData.books) {
  bookByAbbr[book.abbr] = book;
}

const abbrParam = {
  in: "path",
  name: "abbr",
  required: true,
  schema: { type: "string" },
  description:
    "The book abbreviation (e.g. Gn for Genèse, Ex for Exode). See GET /books for the full list.",
};
const chapterParam = {
  in: "path",
  name: "chapter",
  required: true,
  schema: { type: "string" },
  description:
    "The chapter number. May include letter suffixes for split Psalms (e.g. 9A, 9B, 113A, 113B).",
};
const verseParam = {
  in: "path",
  name: "verse",
  required: true,
  schema: { type: "string" },
  description:
    "The verse key. Numeric (e.g. 1, 42), letter-suffixed (e.g. 17A, 1b), or compound (e.g. 3-4).",
};

const notFoundResponse = { description: "Resource not found" };

const specs = {
  openapi: "3.1.0",
  info: {
    title: "L'API de la Saint Bible de Jerusalem",
    version: "2.0.0",
    description:
      "Obtenez les versets des écritures de la Sainte Bible de Jerusalem.",
    license: { name: "MIT", url: "https://spdx.org/licenses/MIT.html" },
  },
  servers: [
    { url: "https://bible-api-lovat.vercel.app/" },
    { url: "http://localhost:8000/" },
  ],
  paths: {
    "/bible.json": {
      get: {
        summary: "Returns the entire Bible as JSON",
        responses: {
          200: {
            description:
              "The entire Bible as a JSON object with a books array",
          },
        },
      },
    },
    "/bible.txt": {
      get: {
        summary: "Returns the entire Bible as plain text",
        responses: {
          200: {
            description:
              "The entire Bible as plain text (one verse per line)",
          },
        },
      },
    },
    "/books": {
      get: {
        summary: "Returns the list of all books with their abbreviations",
        responses: {
          200: {
            description:
              "Array of { abbr, name } objects for each book of the Bible",
          },
        },
      },
    },
    "/books/{abbr}": {
      get: {
        summary: "Returns all chapters and verses for a book",
        parameters: [abbrParam],
        responses: {
          200: { description: "All chapters and verses for the book" },
          404: notFoundResponse,
        },
      },
    },
    "/books/{abbr}/{chapter}": {
      get: {
        summary: "Returns all verses for a chapter",
        parameters: [abbrParam, chapterParam],
        responses: {
          200: { description: "All verses for the chapter" },
          404: notFoundResponse,
        },
      },
    },
    "/books/{abbr}/{chapter}/{verse}": {
      get: {
        summary: "Returns a single verse",
        parameters: [abbrParam, chapterParam, verseParam],
        responses: {
          200: { description: "The verse text" },
          404: notFoundResponse,
        },
      },
    },
  },
};

const SWAGGER_UI_VERSION = "5.17.2";
const CDN = `https://unpkg.com/swagger-ui-dist@${SWAGGER_UI_VERSION}`;
app.get("/swagger", (req, res) => {
  res.type("html").send(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>L'API de la Saint Bible de Jerusalem</title>
  <link rel="stylesheet" type="text/css" href="${CDN}/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="${CDN}/swagger-ui-bundle.js"></script>
  <script src="${CDN}/swagger-ui-standalone-preset.js"></script>
  <script>
    SwaggerUIBundle({
      spec: ${JSON.stringify(specs)},
      dom_id: '#swagger-ui',
      deepLinking: true,
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
      layout: "StandaloneLayout"
    });
  </script>
</body>
</html>`);
});
app.get("/", (req, res) => res.redirect("/swagger"));

app.get("/bible.json", (req, res) => res.json(bibleData));

function sortVerseKeys(keys) {
  return keys.slice().sort((a, b) => {
    const pa = a.match(/^(\d+)(.*)/);
    const pb = b.match(/^(\d+)(.*)/);
    if (!pa || !pb) return a.localeCompare(b);
    const na = parseInt(pa[1], 10);
    const nb = parseInt(pb[1], 10);
    if (na !== nb) return na - nb;
    return pa[2].localeCompare(pb[2]);
  });
}

app.get("/bible.txt", (req, res) => {
  const lines = [];
  for (const book of bibleData.books) {
    for (const [ch, verses] of Object.entries(book.chapters)) {
      const sortedKeys = sortVerseKeys(Object.keys(verses));
      for (const v of sortedKeys) {
        lines.push(`${book.abbr} ${ch},${v} ${verses[v]}`);
      }
    }
  }
  res.type("text/plain").send(lines.join("\n"));
});

app.get("/books", (req, res) => {
  res.json(bibleData.books.map((b) => ({ abbr: b.abbr, name: b.name })));
});

app.get("/books/:abbr", (req, res) => {
  const book = bookByAbbr[req.params.abbr];
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book.chapters);
});

app.get("/books/:abbr/:chapter", (req, res) => {
  const book = bookByAbbr[req.params.abbr];
  if (!book) return res.status(404).json({ error: "Book not found" });
  const chapter = book.chapters[req.params.chapter];
  if (!chapter) return res.status(404).json({ error: "Chapter not found" });
  res.json(chapter);
});

app.get("/books/:abbr/:chapter/:verse", (req, res) => {
  const book = bookByAbbr[req.params.abbr];
  if (!book) return res.status(404).json({ error: "Book not found" });
  const chapter = book.chapters[req.params.chapter];
  if (!chapter) return res.status(404).json({ error: "Chapter not found" });
  const verse = chapter[req.params.verse];
  if (verse === undefined)
    return res.status(404).json({ error: "Verse not found" });
  res.json(verse);
});

app.listen(8000, () => console.log("Server ready on port 8000."));

module.exports = app;
