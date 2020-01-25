import {
  attributesDirective,
  closestDirective,
  eachDirective,
  intervalDirective,
  intersectDirective,
  stateDirective,
  valueDirective,
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
    createDirective("x-each", eachDirective);
    createDirective("x-attr", attributesDirective);
    createDirective("x", valueDirective);
  };

  global.setState = setState;
}

export { initialize };
