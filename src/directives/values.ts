import { BindState, ExtendedHTMLElement } from "../types";
import { evaluateExpression } from "../evaluators";

function evaluateValues(
  stateContainer: HTMLElement,
  state: { [id: string]: any },
  valueKey: string,
  stateKey?: string
) {
  const valueContainers = stateContainer.querySelectorAll(
    `:scope [${valueKey}]`
  );

  for (let i = valueContainers.length; i--; ) {
    const valueContainer = valueContainers[i] as ExtendedHTMLElement;
    const valueParent = stateKey
      ? getStateParent(valueContainer, stateKey)
      : stateContainer;

    // If value container is within another state container, skip it
    if (valueParent !== stateContainer) {
      return;
    }

    const valueProperty = valueContainer.getAttribute(valueKey) || "";

    let evaluatedValue;

    // DOM node case
    if (state.nodeType) {
      evaluatedValue = get(state, valueProperty);
    } else {
      evaluatedValue = state.hasOwnProperty(valueProperty)
        ? state[valueProperty]
        : evaluateExpression(valueProperty, state) || state;
    }

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

function get(object: BindState, keyString: string) {
  const keys = keyString.split(".");
  let ret = object;

  keys.forEach(key => {
    ret = ret[key];
  });

  return ret;
}

function getStateParent(element: Element, stateKey: string): Element | null {
  return element.parentElement
    ? element.parentElement.hasAttribute(stateKey)
      ? element.parentElement
      : getStateParent(element.parentElement, stateKey)
    : null;
}

export default evaluateValues;
