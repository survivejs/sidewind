import { DirectiveParameters } from "../types";

function valueDirective({
  element,
  expression,
  evaluate,
  getState,
}: DirectiveParameters) {
  const evaluatedValue = evaluate(expression, getState(element));

  if (element.localName === "input") {
    element.value = evaluatedValue;
  } else {
    element.innerHTML = evaluatedValue;
  }
}

export default valueDirective;
