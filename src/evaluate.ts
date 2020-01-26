/* eslint no-new-func: 0 */
import { BindState } from "./types";

function evaluate(expression: string, value: BindState = {}) {
  try {
    return Function(
      ...Object.keys(value),
      `return ${expression}`
    )(...Object.values(value));
  } catch (err) {
    console.error("Failed to evaluate", expression, value, err);
  }
}

export default evaluate;
