import getState from "./get-state";
import setState from "./set-state";
import evaluateDirectives from "./evaluate-directives";
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
} from "./directives";
import { ExtendedHTMLElement } from "./types";

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
      { name: "x-if", directive: ifDirective },
      { name: "x-ssr", directive: ssrDirective },
      { name: "x-each", directive: eachDirective },
      { name: "x-attr", directive: attributeDirective },
      { name: "x", directive: valueDirective },
      { name: "x-cloak", directive: cloakDirective },
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
