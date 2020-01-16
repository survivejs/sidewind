/* eslint no-new-func: 0 */
import { BindState } from "./types";

function evaluateExpression(expression: string, value: BindState = {}) {
  try {
    return Function(
      ...Object.keys(value),
      "$",
      `return ${expression}`
    )(...Object.values(value), (_value: any) => ({
      _type: "query",
      _value,
    }));
  } catch (err) {
    console.error("Failed to evaluate", expression, value, err);
  }
}

export default evaluateExpression;
