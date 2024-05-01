import { BindState } from "./types";

function asyncEvaluate(
  expression: string,
  value: BindState = {},
  element: unknown
) {
  try {
    value.element = element;

    return Promise.resolve(
      Function.apply(
        null,
        Object.keys(value).concat(`return ${expression}`)
      )(...Object.values(value))
    );
  } catch (err) {
    console.error("Failed to evaluate", expression, value, err);

    return undefined;
  }
}

export { asyncEvaluate };
