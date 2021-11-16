/// <reference lib="dom" />
import getState from "./src/get-state.ts";
import setState from "./src/set-state.ts";
import evaluateDirectives from "./src/evaluate-directives.ts";
import {
  attributeDirective,
  cloakDirective,
  closestDirective,
  eachDirective,
  intersectDirective,
  intervalDirective,
  promiseDirective,
  recurseDirective,
  stateDirective,
  valueDirective,
} from "./src/directives/index.ts";

declare global {
  interface Window {
    evaluateAllDirectives: typeof evaluateAllDirectives;
    getState: typeof getState;
    setState: typeof setState;
  }
}

function evaluateAllDirectives() {
  evaluateDirectives([
    { name: "x-state", directive: stateDirective },
    { name: "x-each", directive: eachDirective },
    { name: "x-attr", directive: attributeDirective },
    { name: "x", directive: valueDirective },
    { name: "x-cloak", directive: cloakDirective },
    { name: "x-closest", directive: closestDirective },
    { name: "x-recurse", directive: recurseDirective },
    { name: "x-promise", directive: promiseDirective },
    { name: "x-interval", directive: intervalDirective },
    { name: "x-intersect", directive: intersectDirective },
  ]);
}

globalThis.addEventListener("load", evaluateAllDirectives);

window.evaluateAllDirectives = evaluateAllDirectives;
window.getState = getState;
window.setState = setState;
