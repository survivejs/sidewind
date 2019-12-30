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

  for (let i = valueContainers.length; i--; ) {
    const valueContainer = valueContainers[i] as ExtendedHTMLElement;
    const valueProperty = valueContainer.getAttribute(valueKey) || "";
    const evaluatedValue = state[valueProperty]
      ? state[valueProperty]
      : evaluateExpression(valueProperty, state) || state;

    if (valueContainer.localName === "input") {
      valueContainer.value = evaluatedValue;
    } else {
      valueContainer.innerHTML = evaluatedValue;
    }
  }
}

export default evaluateValues;
