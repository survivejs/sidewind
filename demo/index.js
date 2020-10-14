require("./index.pcss");
require("../src");

function highlight(language, str) {
  return hljs.highlight(language, str).value;
}

window.highlight = highlight;
