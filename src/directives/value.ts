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

    if (firstChild && firstChild.getAttribute("x-state")) {
      // TODO: Check why evaluation doesn't complete fully
      evaluateDirectives(directives, element);
    }
  }
}

export default valueDirective;
