import setState from "./set-state";
import evaluateDirectives from "./evaluate-directives";
import {
  attributesDirective,
  closestDirective,
  eachDirective,
  intervalDirective,
  intersectDirective,
  promiseDirective,
  stateDirective,
  valueDirective,
} from "./directives";

declare global {
  interface Window {
    evaluateAllDirectives: typeof evaluateAllDirectives;
    setState: typeof setState;
  }
}

function evaluateAllDirectives() {
  evaluateDirectives([
    { name: "x-state", directive: stateDirective },
    { name: "x-each", directive: eachDirective },
    { name: "x-attr", directive: attributesDirective },
    { name: "x", directive: valueDirective },
    { name: "x-closest", directive: closestDirective },
    { name: "x-promise", directive: promiseDirective },
    { name: "x-interval", directive: intervalDirective },
    { name: "x-intersect", directive: intersectDirective },
  ]);
}

window.addEventListener("load", evaluateAllDirectives);

window.evaluateAllDirectives = evaluateAllDirectives;
window.setState = setState;
