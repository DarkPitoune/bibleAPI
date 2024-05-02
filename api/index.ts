const express = require("express");
const fs = require("fs");
const app = express();

let rawdata = fs.readFileSync("bible.json");
let bible = JSON.parse(rawdata);

app.get("/", (req, res) => res.send("Express on Vercel"));
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
