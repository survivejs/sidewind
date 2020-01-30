import { DirectiveParameters } from "../types";

function valueDirective({
  element,
  expression,
  evaluate,
  getState,
  evaluateDirectives,
  directives,
}: DirectiveParameters) {
  const evaluatedValue = evaluate(expression, getState(element));

  if (element.localName === "input") {
    element.value = evaluatedValue;
  } else {
    element.innerHTML = evaluatedValue;

    const firstChild = element.children[0];
    const closestState = firstChild && firstChild.closest("[x-state]");

    if (closestState) {
      evaluateDirectives(directives, element);
    }
  }
}

export default valueDirective;
