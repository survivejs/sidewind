import { ExtendedHTMLElement } from "../types";
import { evaluateExpression } from "../evaluators";

function evaluateValues(
  stateContainer: HTMLElement,
  state: { [id: string]: any },
  valueKey: string
) {
  const valueContainers = stateContainer.querySelectorAll(
    `:scope [${valueKey}]`
  );

  // TODO: Figure out how to evaluate values only between x-state scopes
  for (let i = valueContainers.length; i--; ) {
    const valueContainer = valueContainers[i] as ExtendedHTMLElement;
    const valueProperty = valueContainer.getAttribute(valueKey) || "";
    const evaluatedValue = state[valueProperty]
      ? state[valueProperty]
      : evaluateExpression(valueProperty, state) || state;

    if (valueContainer.localName === "input") {
      valueContainer.value = evaluatedValue;
    } else {
      valueContainer.innerHTML =
        typeof evaluatedValue === "object"
          ? JSON.stringify(evaluatedValue, null, 2)
          : evaluatedValue;
    }
  }
}

export default evaluateValues;
