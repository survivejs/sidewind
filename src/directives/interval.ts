import { DirectiveParameters } from "../types";

function intervalDirective({
  element,
  expression,
  evaluate,
  setState,
}: DirectiveParameters) {
  const { options = {} } = evaluate(expression);
  const evaluateValue = () => setState(evaluate(expression).state, element);

  setInterval(evaluateValue, options.delay || 1000);

  evaluateValue();
}

export default intervalDirective;
