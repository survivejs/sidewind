import { ExtendedHTMLElement } from "./types";
import getParents from "./get-parents";

function setState(newValue: any, element?: ExtendedHTMLElement) {
  if (!element) {
    element = window.event && (window.event.target as ExtendedHTMLElement);

    if (!element) {
      return;
    }
  }

  let stateContainer = element.hasAttribute("x-state")
    ? element
    : (element.closest("[x-state]") as ExtendedHTMLElement);

  if (!stateContainer) {
    return;
  }

  const state = stateContainer.state;
  const evaluatedValue = isFunction(newValue) ? newValue(state) : newValue;
  let updatedState = evaluatedValue;

  console.log("evaluated value", evaluatedValue);

  if (isObject(state)) {
    const labeledStateContainers = getParents(element, "x-label");

    if (labeledStateContainers.length) {
      // TODO: take labeled state containers into account
      console.log(
        "got labeled state containers",
        evaluatedValue,
        labeledStateContainers
      );
    } else {
      updatedState = Object.assign({}, state, evaluatedValue);
    }
  }

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
