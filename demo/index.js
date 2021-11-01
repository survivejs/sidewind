require("./index.pcss");
require("../src");

function highlight(language, str) {
  return hljs.highlight(language, str).value;
}

function hiClicked(element) {
  setState({ name: "Hi" }, { element, parent: "parent" });
}

function morningClicked(element) {
  setState({ name: "Morning" }, { element, parent: "parent" });
}

function goodbyeClicked(element) {
  setState({ name: "Goodbye" }, { element, parent: "parent" });
}

window.highlight = highlight;
window.hiClicked = hiClicked;
window.morningClicked = morningClicked;
window.goodbyeClicked = goodbyeClicked;
