import {
  evaluateDirectives,
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

window.onload = () =>
  evaluateDirectives([
    { name: "x-state", directive: stateDirective },
    { name: "x-each", directive: eachDirective },
    { name: "x-attr", directive: attributesDirective },
    { name: "x", directive: valueDirective },
    { name: "x-closest", directive: closestDirective },
    { name: "x-interval", directive: intervalDirective },
    { name: "x-intersect", directive: intersectDirective },
  ]);

window.setState = setState;
