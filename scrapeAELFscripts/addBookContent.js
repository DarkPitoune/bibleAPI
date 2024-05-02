const fetchHTML = require("./fetchHtml");
const { parse } = require("node-html-parser");

const addBookContent = async ({ name, path }) => {
  console.log("parsing", name, path);

  const bookContent = {};

  let content = await fetchHTML(path);
  while (content) {
    const root = parse(content).getElementById("right-col");
    const chapter = root.querySelector(".dropdown-toggle").text.split(" ")[1];
    const versesTag = root.querySelectorAll("p");
    const verses = {};
    versesTag.forEach((verse) => {
      const number = verse.text.split(" ")[0];
      const text = verse.text.split(" ").slice(1).join(" ");
      verses[number] = text;
    });
    const nextButton = root
      .querySelectorAll("a")
      .find((a) => a.text === "Suivant");
    bookContent[chapter] = verses;
    if (nextButton) {
      content = await fetchHTML(nextButton.attributes.href);
    } else {
      content = null;
    }
  }
  return bookContent;
};

module.exports = addBookContent;
