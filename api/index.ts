const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { abbrToName, nameToAbbr } = require("./books");

const app = express();

app.use(cors());

let rawdata = fs.readFileSync(path.join(__dirname, "bible.json"));
let bible = JSON.parse(rawdata);

function resolveBook(abbr) {
  const fullName = abbrToName[abbr];
  if (!fullName || !bible[fullName]) return null;
  return { fullName, data: bible[fullName] };
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
  description: "The chapter number",
};
const verseParam = {
  in: "path",
  name: "verse",
  required: true,
  schema: { type: "string" },
  description: "The verse number (auto-padded to 2 digits)",
};

const notFoundResponse = { description: "Resource not found" };

const specs = {
  openapi: "3.1.0",
  info: {
    title: "L'API de la Saint Bible de Jerusalem",
    version: "1.0.0",
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
              "The entire Bible as a JSON object keyed by abbreviation",
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

app.get("/bible.json", (req, res) => res.json(bible));

app.get("/bible.txt", (req, res) => {
  const lines = [];
  for (const [fullName, chapters] of Object.entries(bible)) {
    const abbr = nameToAbbr[fullName] || fullName;
    for (const [ch, verses] of Object.entries(chapters)) {
      for (const [v, text] of Object.entries(verses)) {
        lines.push(`${abbr} ${ch},${v} ${text}`);
      }
    }
  }
  res.type("text/plain").send(lines.join("\n"));
});

app.get("/books", (req, res) => {
  const books = Object.entries(abbrToName).map(([abbr, name]) => ({
    abbr,
    name,
  }));
  res.json(books);
});

app.get("/books/:abbr", (req, res) => {
  const book = resolveBook(req.params.abbr);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book.data);
});

app.get("/books/:abbr/:chapter", (req, res) => {
  const book = resolveBook(req.params.abbr);
  if (!book) return res.status(404).json({ error: "Book not found" });
  const chapter = book.data[req.params.chapter];
  if (!chapter) return res.status(404).json({ error: "Chapter not found" });
  res.json(chapter);
});

app.get("/books/:abbr/:chapter/:verse", (req, res) => {
  const book = resolveBook(req.params.abbr);
  if (!book) return res.status(404).json({ error: "Book not found" });
  const chapter = book.data[req.params.chapter];
  if (!chapter) return res.status(404).json({ error: "Chapter not found" });
  const verseKey =
    req.params.verse.length === 1
      ? `0${req.params.verse}`
      : req.params.verse;
  const verse = chapter[verseKey];
  if (verse === undefined)
    return res.status(404).json({ error: "Verse not found" });
  res.json(verse);
});

app.listen(8000, () => console.log("Server ready on port 8000."));

module.exports = app;
