import { evaluateClosest, evaluateEach, evaluateState } from "./directives";
import setState from "./set-state";

declare global {
  interface Window {
    setState: typeof setState;
  }
}

function initialize(global = window) {
  global.onload = () => {
    evaluateEach(document.querySelectorAll("[x-each]"), "x-each", "x-state");
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
      "x-attr"
    );
  };

  global.setState = setState;
}

export { initialize };
