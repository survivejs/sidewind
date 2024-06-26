import { BindState, DirectiveParameters } from "../types";

function promiseDirective({
  element,
  expression,
  evaluate,
  setState,
}: DirectiveParameters) {
  // @ts-ignore TODO: Fix the type
  const { state } = evaluate(expression, {}, element);

  Promise.all(Object.values(state))
    .then((values) => {
      const newState: BindState = {};

      Object.keys(state).forEach((key, i) => {
        newState[key] = values[i];
      });

      setState(newState, { element });
    })
    .catch((error) => {
      setState({ error }, { element });
    });
}
promiseDirective.skipEvaluation = true;

export default promiseDirective;
