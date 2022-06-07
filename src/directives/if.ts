import { DirectiveParameters } from "../types";

function ifDirective({
  element,
  expression,
  evaluate,
  getState,
}: DirectiveParameters) {
  element.hidden = !evaluate(expression, getState(element));
}

export default ifDirective;
