import { DirectiveParameters } from "../types";

function ifDirective({
  element,
  expression,
  evaluate,
  getState,
}: DirectiveParameters) {
  // @ts-ignore TODO: Fix the type
  element.hidden = !evaluate(expression, getState(element));
}

export default ifDirective;
