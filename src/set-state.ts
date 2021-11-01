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
    } else {
      console.warn(
        "Failed to find matching parents for",
        parent,
        "in",
        labeledStateContainers,
        "for",
        element,
        "using",
        labelName
      );
    }
  } else {
    const state = stateContainer.state;
    const evaluatedValue = isFunction(newValue) ? newValue(state) : newValue;
    const updatedState = isObject(evaluatedValue)
      ? Object.assign({}, state, evaluatedValue)
      : evaluatedValue;

    // The gotcha with maintaining state like this is that you cannot serialize
    // and restore complex objects like HTMLElements for example
    stateContainer.setAttribute("x-state", JSON.stringify(updatedState));
    stateContainer.state = updatedState;

    // Signal to the state container that state was updated within. x-state
    // will notice the update thanks to a mutation observer
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
