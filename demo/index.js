const hljs = require("highlight.js/lib/highlight.js");
const html = require("highlight.js/lib/languages/xml");

const js = require("highlight.js/lib/languages/javascript");

require("highlight.js/styles/dracula.css");
require("./index.pcss");
require("../src");

hljs.registerLanguage("html", html);
hljs.registerLanguage("javascript", js);

function highlight(language, str) {
  return hljs.highlight(language, str).value;
}

window.highlight = highlight;
