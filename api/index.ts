const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");


const app = express();

app.use(cors());

let rawdata = fs.readFileSync(path.join(__dirname, "bible.json"));
let bible = JSON.parse(rawdata);

const bookParam = {
  in: "path",
  name: "book",
  required: true,
  schema: { type: "string" },
  description: "The book name (e.g. Genèse)",
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

const specs = {
  openapi: "3.1.0",
  info: {
    title: "L'API de la Saint Bible de Jerusalem",
    version: "0.1.0",
    description:
      "Obtenez les versets des écritures de la Sainte Bible de Jerusalem.",
    license: { name: "MIT", url: "https://spdx.org/licenses/MIT.html" },
  },
  servers: [
    { url: "https://bible-api-lovat.vercel.app/" },
    { url: "http://localhost:8000/" },
  ],
  paths: {
    "/book/": {
      get: {
        summary: "Returns the list of all the books",
        responses: { 200: { description: "The list of the books' names" } },
      },
    },
    "/book/all": {
      get: {
        summary: "Returns the entire Bible",
        responses: {
          200: { description: "All books with their chapters and verses" },
        },
      },
    },
    "/book/{book}": {
      get: {
        summary: "Returns the list of chapters for a book",
        parameters: [bookParam],
        responses: { 200: { description: "The list of chapter numbers" } },
      },
    },
    "/book/{book}/all": {
      get: {
        summary: "Returns all chapters and verses for a book",
        parameters: [bookParam],
        responses: {
          200: { description: "All chapters and verses for the book" },
        },
      },
    },
    "/book/{book}/{chapter}/": {
      get: {
        summary: "Returns the list of verses for a chapter",
        parameters: [bookParam, chapterParam],
        responses: { 200: { description: "The list of verse numbers" } },
      },
    },
    "/book/{book}/{chapter}/all": {
      get: {
        summary: "Returns all verses for a chapter",
        parameters: [bookParam, chapterParam],
        responses: { 200: { description: "All verses for the chapter" } },
      },
    },
    "/book/{book}/{chapter}/{verse}": {
      get: {
        summary: "Returns a single verse",
        parameters: [bookParam, chapterParam, verseParam],
        responses: { 200: { description: "The verse text" } },
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

app.get("/book/", (req, res) => res.send(Object.keys(bible)));
app.get("/book/all", (req, res) => res.send(bible));
app.get("/book/:book", (req, res) =>
  res.send(Object.keys(bible[req.params.book]))
);
app.get("/book/:book/all", (req, res) => res.send(bible[req.params.book]));
app.get("/book/:book/:chapter/", (req, res) =>
  res.send(Object.keys(bible[req.params.book][req.params.chapter]))
);
app.get("/book/:book/:chapter/all", (req, res) =>
  res.send(bible[req.params.book][req.params.chapter])
);
app.get("/book/:book/:chapter/:verse", (req, res) => {
  req.params.verse =
    req.params.verse.length === 1 ? `0${req.params.verse}` : req.params.verse;
  res.send(bible[req.params.book][req.params.chapter][req.params.verse]);
});

app.listen(8000, () => console.log("Server ready on port 8000."));

module.exports = app;
