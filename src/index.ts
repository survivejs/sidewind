import {
  evaluateClosest,
  evaluateEach,
  evaluateIntersect,
  evaluateInterval,
  evaluateState,
} from "./directives";
import setState from "./set-state";

declare global {
  interface Window {
    setState: typeof setState;
  }
}

function initialize(global = window) {
  global.onload = () => {
    evaluateClosest(
      document.querySelectorAll("[x-closest]"),
      "x-closest",
      "x-state"
    );
    evaluateIntersect(
      document.querySelectorAll("[x-intersect]"),
      "x-intersect",
      "x-state"
    );
    evaluateInterval(
      document.querySelectorAll("[x-interval]"),
      "x-interval",
      "x-state"
    );
    evaluateState(
      document.querySelectorAll("[x-state]"),
      "x-state",
      "x-bind",
      "x-each",
      "x-attr",
      "x-label"
    );
    evaluateEach(document.querySelectorAll("[x-each]"), "x-each", "x-state");
  };

  global.setState = setState;
}

export { initialize };
