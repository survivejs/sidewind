import {
  closestDirective,
  evaluateState,
  intervalDirective,
  intersectDirective,
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
    createDirective("x-interval", intervalDirective);
    createDirective("x-intersect", intersectDirective);
    evaluateState(
      document.querySelectorAll(`[${directiveKeys.state}]`),
      directiveKeys.state
    );
  };

  global.setState = setState;
}

export { initialize };
