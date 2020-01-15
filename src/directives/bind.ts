/* eslint no-new-func: 0 */
import { BindState, ExtendedHTMLElement } from "../types";
import { get, getLabeledState } from "../utils";

function evaluateBind(
  stateContainer: HTMLElement,
  state: { [id: string]: any },
  bindKey: string,
  labelKey: string,
  stateKey?: string
) {
  const bindContainers = Array.from(
    stateContainer.querySelectorAll(`:scope [${bindKey}]`)
  );

  // A state container can be a value container itself
  if (stateContainer.hasAttribute(bindKey)) {
    bindContainers.push(stateContainer);
  }

  for (let i = bindContainers.length; i--; ) {
    const bindContainer = bindContainers[i] as ExtendedHTMLElement;
    const bindParent = stateKey
      ? getStateParent(bindContainer, stateKey)
      : stateContainer;

    // If value container is within another state container, skip it
    if (bindParent !== stateContainer) {
      return;
    }

    const bindProperty = bindContainer.getAttribute(bindKey) || "";

    let evaluatedValue;

    // DOM node case
    if (state.nodeType) {
      evaluatedValue = get(state, bindProperty);
    } else {
      const labeledState = getLabeledState(bindContainer, labelKey);

      evaluatedValue = state.hasOwnProperty(bindProperty.split(".")[0])
        ? get(state, bindProperty)
        : evaluateCaseExpression(bindProperty, { ...labeledState, state }) ||
          state;
    }

    if (bindContainer.localName === "input") {
      bindContainer.value = evaluatedValue;
    } else {
      bindContainer.innerHTML =
        typeof evaluatedValue === "object"
          ? JSON.stringify(evaluatedValue, null, 2)
          : evaluatedValue;
    }
  }
}

// TODO: Combine with the other evaluators + add support for $
function evaluateCaseExpression(expression: string, value: BindState) {
  try {
    return Function(
      ...Object.keys(value),
      `return ${expression}`
    )(...Object.values(value));
  } catch (err) {
    console.error("Failed to evaluate", expression, value, err);
  }
}

function getStateParent(element: Element, stateKey: string): Element | null {
  // A state container can be a value container itself
  if (element.hasAttribute(stateKey)) {
    return element;
  }

  return element.parentElement
    ? element.parentElement.hasAttribute(stateKey)
      ? element.parentElement
      : getStateParent(element.parentElement, stateKey)
    : null;
}

export default evaluateBind;
