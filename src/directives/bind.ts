import { BindState, ExtendedHTMLElement } from "../types";
import { evaluateExpression } from "../evaluators";

function evaluateBind(
  stateContainer: HTMLElement,
  state: { [id: string]: any },
  bindKey: string,
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
      evaluatedValue = state.hasOwnProperty(bindProperty)
        ? state[bindProperty]
        : evaluateExpression(bindProperty, state) || state;
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

function get(object: BindState, keyString: string) {
  const keys = keyString.split(".");
  let ret = object;

  keys.forEach(key => {
    ret = ret[key];
  });

  return ret;
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
