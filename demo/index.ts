import {
  evaluateDirectives,
  setState,
  attributesDirective,
  closestDirective,
  eachDirective,
  // intervalDirective,
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

function initialize(global = window) {
  global.onload = () =>
    evaluateDirectives([
      { name: "x-closest", directive: closestDirective },
      // TODO: Enable again
      // { name: 'x-interval', directive: intervalDirective },
      { name: "x-intersect", directive: intersectDirective },
      { name: "x-state", directive: stateDirective },
      { name: "x-each", directive: eachDirective },
      { name: "x-attr", directive: attributesDirective },
      { name: "x", directive: valueDirective },
    ]);

  global.setState = setState;
}

initialize();
