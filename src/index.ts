import {
  closestDirective,
  evaluateIntersect,
  evaluateInterval,
  evaluateState,
} from "./directives";
import directiveKeys from "./directive-keys";
import setState from "./set-state";
import createDirective from "./create-directive";

declare global {
  interface Window {
    setState: typeof setState;
  }
}

function initialize(global = window) {
  global.onload = () => {
    createDirective("x-closest", closestDirective);
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
      directiveKeys.state
    );
  };

  global.setState = setState;
}

export { initialize };
