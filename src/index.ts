import {
  evaluateClosest,
  evaluateEach,
  evaluateIntersect,
  evaluateInterval,
  evaluateState,
} from "./directives";
import setState from "./set-state";
import directiveKeys from "./directive-keys";

declare global {
  interface Window {
    setState: typeof setState;
  }
}

function initialize(global = window) {
  global.onload = () => {
    evaluateClosest(
      document.querySelectorAll(`[${directiveKeys.closest}]`),
      directiveKeys.closest,
      directiveKeys.state
    );
    evaluateIntersect(
      document.querySelectorAll(`[${directiveKeys.intersect}]`),
      directiveKeys.intersect,
      directiveKeys.state
    );
    evaluateInterval(
      document.querySelectorAll(`[${directiveKeys.interval}]`),
      directiveKeys.interval,
      directiveKeys.state
    );
    evaluateState(
      document.querySelectorAll(`[${directiveKeys.state}]`),
      directiveKeys.state,
      directiveKeys.each,
      directiveKeys.attr,
      directiveKeys.label,
      directiveKeys.x
    );
    evaluateEach(
      document.querySelectorAll(`[${directiveKeys.each}]`),
      directiveKeys.each,
      directiveKeys.state
    );
  };

  global.setState = setState;
}

export { initialize };
