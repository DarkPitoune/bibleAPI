const { parse } = require("node-html-parser");

const getBookPath = (content) => {
  const dom = parse(content);
  const links = dom.querySelectorAll("a").filter((anchor) => {
    const href = anchor.getAttribute("href");
    return href.startsWith("/bible/") && !href.includes("/Ps/");
  });
  const result = links.map((anchor) => {
    return {
      name: anchor.text,
      path: anchor.getAttribute("href"),
    };
  });
  result.push({
    name: "Psaumes",
    path: "/bible/Ps/1",
  });
  return result;
};

module.exports = getBookPath;
