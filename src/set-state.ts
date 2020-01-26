import { ExtendedHTMLElement } from "./types";

function setState(newValue: any, element?: ExtendedHTMLElement) {
  if (!element) {
    element = window.event && (window.event.target as ExtendedHTMLElement);

    if (!element) {
      return;
    }
  }

  let stateContainer = element.hasAttribute("x-state")
    ? element
    : (element.closest(`[x-state]`) as ExtendedHTMLElement);

  if (!stateContainer) {
    return;
  }

  const state = stateContainer.state;
  const evaluatedValue = isFunction(newValue) ? newValue(state) : newValue;
  const updatedState = isObject(state)
    ? { ...state, ...evaluatedValue }
    : evaluatedValue;

  stateContainer.state = updatedState;

  // Signal to the state container that state was updated within
  element.setAttribute("x-updated", "");
}

function isFunction(obj: any) {
  return typeof obj === "function";
}

function isObject(obj: any) {
  return typeof obj === "object" && obj && !obj.nodeName;
}

export default setState;
