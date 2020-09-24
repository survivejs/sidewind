import { ExtendedHTMLElement } from "./types";
import getParents from "./get-parents";

function setState(
  newValue: any,
  {
    element,
    parent,
  }: {
    element?: ExtendedHTMLElement;
    parent?: string;
    foo?: any;
  } = {}
) {
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
  let updatedState;

  if (parent) {
    const labelName = "x-label";
    const labeledStateContainers = getParents(element, labelName);
    const matchingParents = labeledStateContainers.filter(
      (elem) => elem.getAttribute(labelName) === parent
    );

    if (matchingParents.length) {
      const matchingParent = matchingParents[0];

      // Signal to the state container that state was updated with a parent
      element.setAttribute("x-updated", parent);

      setState(newValue, { element: matchingParent as ExtendedHTMLElement });
    }
  } else {
    updatedState = isObject(evaluatedValue)
      ? Object.assign({}, state, evaluatedValue)
      : evaluatedValue;

    stateContainer.state = updatedState;

    // Can this be avoided?
    stateContainer.setAttribute("x-state", JSON.stringify(updatedState));

    // Signal to the state container that state was updated within
    element.setAttribute("x-updated", "");
  }
}

function isFunction(obj: any) {
  return typeof obj === "function";
}

function isObject(obj: any) {
  return typeof obj === "object" && obj && !obj.nodeName;
}

export default setState;
