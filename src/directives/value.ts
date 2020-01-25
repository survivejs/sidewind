import { BindState, DirectiveParameters, ExtendedHTMLElement } from "../types";
import evaluateExpression from "../evaluate-expression";
import { getLabeledState } from "../utils";

function valueDirective({ element, expression }: DirectiveParameters) {
  // TODO: Common pattern, set up getState
  const closestStateContainer = element.closest(
    `[x-state]`
  ) as ExtendedHTMLElement;
  const { state }: { state: BindState } = closestStateContainer;
  const labeledState = getLabeledState(element, "x-label");

  const evaluatedValue = evaluateExpression(expression, {
    ...labeledState,
    state,
  });

  if (element.localName === "input") {
    element.value = evaluatedValue;
  } else {
    element.innerHTML = evaluatedValue;
  }
}

export default valueDirective;
