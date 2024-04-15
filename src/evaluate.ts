/* eslint no-new-func: 0 */
import { BindState } from "./types";

function evaluate(expression: string, value: BindState = {}, element: unknown) {
  try {
    value.element = element;

    return Function.apply(
      null,
      Object.keys(value).concat(`return ${expression}`)
    )(...Object.values(value));
  } catch (err) {
    console.error("Failed to evaluate", expression, value, err);
  }
}

export default evaluate;
