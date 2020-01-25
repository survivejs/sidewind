import {
  evaluateDirective,
  setState,
  attributesDirective,
  closestDirective,
  eachDirective,
  intervalDirective,
  intersectDirective,
  stateDirective,
  valueDirective,
} from "../src";

import "highlight.js/styles/dracula.css";
import "./index.pcss";

declare global {
  interface Window {
    setState: typeof setState;
  }
}

function evaluateDirectives() {
  evaluateDirective("x-closest", closestDirective);
  evaluateDirective("x-interval", intervalDirective);
  evaluateDirective("x-intersect", intersectDirective);
  evaluateDirective("x-state", stateDirective);
  evaluateDirective("x-each", eachDirective);
  evaluateDirective("x-attr", attributesDirective);
  evaluateDirective("x", valueDirective);
}

function initialize(global = window) {
  global.onload = evaluateDirectives;

  // TODO: Pass evaluateDirectives + figure out how setState would
  // work internally (avoid recursion)
  global.setState = setState;
}

initialize();
