import {
  evaluateClosest,
  evaluateEach,
  evaluateIntersect,
  evaluateInterval,
  evaluateState,
} from "./directives";
import setState from "./set-state";
import directiveKeys from "./directive-keys";
import generateAttributeKeys from "./generate-attribute-keys";

declare global {
  interface Window {
    setState: typeof setState;
  }
}

function initialize(global = window) {
  global.onload = () => {
    generateAttributeKeys(
      Array.from(document.querySelectorAll(`[${directiveKeys.state}]`)),
      directiveKeys.attribute,
      directiveKeys.value
    );
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
      directiveKeys.attribute,
      directiveKeys.label,
      directiveKeys.value
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
