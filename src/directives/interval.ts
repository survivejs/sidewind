import type { DirectiveParameters } from "../../types.ts";

function intervalDirective({
  element,
  expression,
  evaluate,
  setState,
}: DirectiveParameters) {
  // @ts-ignore TODO: Fix the type
  const { options = {} } = evaluate(expression);
  // @ts-ignore TODO: Fix the type
  const evaluateValue = () => setState(evaluate(expression).state, { element });

  setInterval(evaluateValue, options.delay || 1000);

  evaluateValue();
}
intervalDirective.skipEvaluation = true;

export default intervalDirective;
