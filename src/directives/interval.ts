import { DirectiveParameters } from "../types";

function intervalDirective({
  element,
  expression,
  evaluate,
  setState,
}: DirectiveParameters) {
  const { options, state } = evaluate(expression);

  // TODO: Eliminate somehow - should setState handle this?
  const initialState = evaluate(element.getAttribute("x-state") || "");
  element.setAttribute(
    "x-state",
    JSON.stringify(initialState ? { ...initialState, ...state } : state)
  );

  setInterval(() => {
    setState(evaluate(expression).state, element);
  }, options.delay || 1000);
}

export default intervalDirective;
