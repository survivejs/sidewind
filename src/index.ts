import {
  attributesDirective,
  closestDirective,
  intervalDirective,
  intersectDirective,
  stateDirective,
} from "./directives";
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
    createDirective("x-state", stateDirective);
    createDirective("x-attr", attributesDirective);
  };

  global.setState = setState;
}

export { initialize };
