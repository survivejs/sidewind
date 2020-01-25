import { DirectiveParameters } from "../types";
import evaluateExpression from "../evaluate-expression";

function intervalDirective({
  element,
  expression,
  parameters: { options, state },
  setState,
}: DirectiveParameters) {
  // TODO: Eliminate somehow - should setState handle this?
  const initialState = evaluateExpression(
    element.getAttribute("x-state") || ""
  );
  element.setAttribute(
    "x-state",
    JSON.stringify(initialState ? { ...initialState, ...state } : state)
  );

  setInterval(() => {
    setState(evaluateExpression(expression).state, element);
  }, options.delay || 1000);
}

export default intervalDirective;
