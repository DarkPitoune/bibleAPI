const fetchHTML = require("./fetchHtml");
const getBookPath = require("./listBooks");
const addBookContent = require("./addBookContent");
const fs = require("fs");

const bible = {};

const print = async () => {
  const bookPage = await fetchHTML("/bible");
  const books = getBookPath(bookPage);
  const promises = books.map((book) => addBookContent(book));
  const fullBooks = await Promise.all(promises);

  fullBooks.forEach((fullBook, index) => {
    bible[books[index].name] = fullBook;
  });
  fs.writeFileSync("bible.json", JSON.stringify(bible, null, 2));
};
print();
