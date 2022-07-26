/* eslint no-new-func: 0 */
import type { BindState } from "../types.ts";

function evaluate(expression: string, value: BindState = {}) {
  try {
    return Function.apply(
      null,
      Object.keys(value).concat(`return ${expression}`)
    )(...Object.values(value));
  } catch (err) {
    console.error("Failed to evaluate", expression, value, err);
  }
}

export default evaluate;
