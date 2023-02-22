/// <reference lib="dom" />
import getState from "./src/get-state.ts";
import setState from "./src/set-state.ts";
import evaluateDirectives from "./src/evaluate-directives.ts";
import {
  attributeDirective,
  cloakDirective,
  closestDirective,
  eachDirective,
  ifDirective,
  intersectDirective,
  intervalDirective,
  promiseDirective,
  recurseDirective,
  ssrDirective,
  stateDirective,
  valueDirective,
} from "./src/directives/index.ts";
import { ExtendedHTMLElement } from "./types.ts";

declare global {
  interface Window {
    evaluateAllDirectives: typeof evaluateAllDirectives;
    getState: typeof getState;
    setState: typeof setState;
  }
}

function evaluateAllDirectives(parent?: ExtendedHTMLElement) {
  evaluateDirectives(
    [
      { name: "x-state", directive: stateDirective },
      { name: "x-cloak", directive: cloakDirective },
      { name: "x-if", directive: ifDirective },
      { name: "x-ssr", directive: ssrDirective },
      { name: "x-each", directive: eachDirective },
      { name: "x-attr", directive: attributeDirective },
      { name: "x", directive: valueDirective },
      { name: "x-closest", directive: closestDirective },
      { name: "x-recurse", directive: recurseDirective },
      { name: "x-promise", directive: promiseDirective },
      { name: "x-interval", directive: intervalDirective },
      { name: "x-intersect", directive: intersectDirective },
    ],
    parent
  );
}

self.addEventListener("load", () => evaluateAllDirectives());

self.evaluateAllDirectives = evaluateAllDirectives;
self.getState = getState;
self.setState = setState;

export { getState, setState, evaluateAllDirectives };
