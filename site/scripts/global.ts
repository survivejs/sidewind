import HighlightJS from "https://unpkg.com/@highlightjs/cdn-assets@11.3.1/es/core.min.js";
import { setup } from "https://cdn.skypack.dev/twind@0.16.16/shim?min";
import highlightJS from "https://unpkg.com/highlight.js@11.3.1/es/languages/javascript";
import highlightXML from "https://unpkg.com/highlight.js@11.3.1/es/languages/xml";
import twindSetup from "../twindSetup.ts";
import "../../src/index.ts";

setup(twindSetup);

HighlightJS.registerLanguage("js", highlightJS);
HighlightJS.registerLanguage("html", highlightXML);

// @ts-ignore This comes from sidewind
const setState = window.setState;

function highlight(language, str) {
  return HighlightJS.highlight(str, { language }).value;
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

function bothClicked(element) {
  setState({ name: "Goodbye" }, { element, parent: "parent" });
  setState({ value: "someone" }, { element, parent: "child" });
}

declare global {
  interface Window {
    highlight: typeof highlight;
    hiClicked: typeof hiClicked;
    morningClicked: typeof morningClicked;
    goodbyeClicked: typeof goodbyeClicked;
    bothClicked: typeof bothClicked;
  }
}

window.highlight = highlight;
window.hiClicked = hiClicked;
window.morningClicked = morningClicked;
window.goodbyeClicked = goodbyeClicked;
window.bothClicked = bothClicked;
