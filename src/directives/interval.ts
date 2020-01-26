import { DirectiveParameters } from "../types";

function intervalDirective({
  element,
  expression,
  evaluate,
  setState,
}: DirectiveParameters) {
  const { options = {} } = evaluate(expression);

  setInterval(() => {
    setState(evaluate(expression).state, element);
  }, options.delay || 1000);
}

export default intervalDirective;
