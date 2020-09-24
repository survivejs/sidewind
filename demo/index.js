const hljs = require("highlight.js");

const html = require("highlight.js/lib/languages/xml.js");
const js = require("highlight.js/lib/languages/javascript.js");

require("./index.pcss");
require("../src");

hljs.registerLanguage("html", html);
hljs.registerLanguage("javascript", js);

function highlight(language, str) {
  return hljs.highlight(language, str).value;
}

window.highlight = highlight;
