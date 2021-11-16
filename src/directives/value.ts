import type { DirectiveParameters } from "../types.ts";

function valueDirective({
  element,
  expression,
  evaluate,
  getState,
  evaluateDirectives,
  directives,
}: DirectiveParameters) {
  const state = evaluate(expression, getState(element));

  if (element.localName === "input") {
    element.value = state;
  } else {
    element.innerHTML = state;

    const firstChild = element.children[0];
    const closestState = firstChild && firstChild.closest("[x-state]");

    if (closestState) {
      evaluateDirectives(directives, element);
    }
  }
}

export default valueDirective;
