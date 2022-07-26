import type { DirectiveParameters } from "../../types.ts";

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
