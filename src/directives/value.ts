import { asyncEvaluate } from "../async-evaluate";
import { DirectiveParameters } from "../types";

async function valueDirective({
  element,
  expression,
  getState,
  evaluateDirectives,
  directives,
}: DirectiveParameters) {
  // @ts-ignore TODO: Fix the type
  const state = await asyncEvaluate(expression, getState(element), element);

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
