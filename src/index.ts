import { ExtendedHTMLElement } from "./types";
import {
  evaluateClasses,
  evaluateEach,
  evaluateState,
  evaluateValues,
} from "./directives";

declare global {
  interface Window {
    setState: typeof setState;
  }
}

function setState(newValue: any) {
  const element = window.event && (window.event.target as ExtendedHTMLElement);

  if (!element) {
    return;
  }

  const stateContainer = element.closest("[x-state]") as ExtendedHTMLElement;

  if (!stateContainer) {
    return;
  }

  const state = stateContainer.state;
  const updatedState =
    typeof state === "object" ? { ...state, ...newValue } : newValue;

  element.state = updatedState;

  stateContainer.setAttribute("x-state", JSON.stringify(updatedState));
  stateContainer.state = updatedState;

  evaluateEach(
    stateContainer.querySelectorAll("[x-each]"),
    "x-each",
    "x-state"
  );
  evaluateValues(stateContainer, updatedState, "x-value", "x-state");
  evaluateClasses(stateContainer, updatedState);
  evaluateState(stateContainer.querySelectorAll("[x-state]"), "x-state");
}

function initialize(global = window) {
  global.onload = () => {
    evaluateEach(document.querySelectorAll("[x-each]"), "x-each", "x-state");
    evaluateState(document.querySelectorAll("[x-state]"), "x-state");
  };

  global.setState = setState;
}

export { initialize };
