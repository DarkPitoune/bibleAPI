const express = require("express");
const fs = require("fs");
const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "L'API de la Saint Bible de Jerusalem",
      version: "0.1.0",
      description:
        "Obtenez les versets des écritures de la Sainte Bible de Jerusalem.",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
    },
    servers: [
      {
        url: "https://bible-api-lovat.vercel.app/",
      },
      {
        url: "http://localhost:8000/",
      },
    ],
  },
  apis: ["./index.ts"],
};

const app = express();

app.use(cors());

let rawdata = fs.readFileSync(path.join(__dirname, "bible.json"));
let bible = JSON.parse(rawdata);

const specs = swaggerJsdoc(options);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(specs));
app.get("/", (req, res) => res.redirect("/swagger"));
/**
 * @swagger
 * /book/:
 *   get:
 *     summary: Returns the list of all the books
 *     responses:
 *       200:
 *         description: The list of the books' names
 */
app.get("/book/", (req, res) => res.send(Object.keys(bible)));

/**
 * @swagger
 * /book/all:
 *  get:
 *   summary: Returns the list of all the books with their chapters and verses
 *  responses:
 *  200:
 *  description: The list of the books with their chapters and verses
 */
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
