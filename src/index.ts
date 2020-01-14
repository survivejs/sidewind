import { evaluateClosest, evaluateEach, evaluateState } from "./directives";
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
    evaluateState(
      document.querySelectorAll("[x-state]"),
      "x-state",
      "x-bind",
      "x-each",
      "x-attr",
      "x-label"
    );

    // Since x-each generates x-state, re-evaluation is needed
    // TODO: Figure out a way to simplify
    evaluateEach(document.querySelectorAll("[x-each]"), "x-each", "x-state");
    evaluateState(
      document.querySelectorAll("[x-state]"),
      "x-state",
      "x-bind",
      "x-each",
      "x-attr",
      "x-label"
    );
  };

  global.setState = setState;
}

export { initialize };
