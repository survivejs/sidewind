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
      //{ name: 'x-interval', directive: intervalDirective },
      { name: "x-state", directive: stateDirective },
      { name: "x-each", directive: eachDirective },
      { name: "x-attr", directive: attributesDirective },
      { name: "x", directive: valueDirective },
      { name: "x-closest", directive: closestDirective },
      { name: "x-intersect", directive: intersectDirective },
    ]);

  global.setState = setState;
}

initialize();
