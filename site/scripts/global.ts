import HighlightJS from "https://unpkg.com/@highlightjs/cdn-assets@11.7.0/es/core.min.js";
import highlightJS from "https://unpkg.com/highlight.js@11.7.0/es/languages/javascript";
import highlightXML from "https://unpkg.com/highlight.js@11.7.0/es/languages/xml.js";
import { install } from "https://cdn.skypack.dev/@twind/core@1.1.1?min";
import twindSetup from "../twindSetup.ts";
import "../../src/index.ts";

install(twindSetup);

HighlightJS.registerLanguage("js", highlightJS);
HighlightJS.registerLanguage("html", highlightXML);

function highlight(language: string, str: string) {
  return HighlightJS.highlight(str, { language }).value;
}

function hiClicked(element: HTMLElement) {
  setState({ name: "Hi" }, { element, parent: "parent" });
}

function morningClicked(element: HTMLElement) {
  setState({ name: "Morning" }, { element, parent: "parent" });
}

function goodbyeClicked(element: HTMLElement) {
  setState({ name: "Goodbye" }, { element, parent: "parent" });
}

function bothClicked(element: HTMLElement) {
  setState({ name: "Goodbye" }, { element, parent: "parent" });
  setState({ value: "someone" }, { element, parent: "child" });
}

function complexOperation(input: string) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(input + "demo"), 500);
  });
}

declare global {
  interface Window {
    complexOperation: typeof complexOperation;
    highlight: typeof highlight;
    hiClicked: typeof hiClicked;
    morningClicked: typeof morningClicked;
    goodbyeClicked: typeof goodbyeClicked;
    bothClicked: typeof bothClicked;
  }
}

window.complexOperation = complexOperation;
window.highlight = highlight;
window.hiClicked = hiClicked;
window.morningClicked = morningClicked;
window.goodbyeClicked = goodbyeClicked;
window.bothClicked = bothClicked;
