import { DirectiveParameters } from "../types";

function intervalDirective({
  element,
  expression,
  evaluate,
  setState,
}: DirectiveParameters) {
  // @ts-ignore TODO: Fix the type
  const { options = {} } = evaluate(expression, {}, element);
  // @ts-ignore TODO: Fix the type
  const evaluateValue = () =>
    // @ts-ignore TODO: Fix the type
    setState(evaluate(expression, {}, element).state, { element });

  setInterval(evaluateValue, options.delay || 1000);

  evaluateValue();
}
intervalDirective.skipEvaluation = true;

export default intervalDirective;
