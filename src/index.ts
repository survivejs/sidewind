import { ExtendedHTMLElement } from "./types";
import {
  evaluateClasses,
  evaluateEach,
  evaluateFetch,
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

  evaluateValues(stateContainer, updatedState, "x-value", "x-state");
  evaluateClasses(stateContainer, updatedState);
  evaluateState(stateContainer.querySelectorAll("[x-state]"), "x-state");
  evaluateEach(
    stateContainer.querySelectorAll("[x-each]"),
    "x-each",
    "x-state"
  );
}

function initialize(global = window) {
  global.onload = () => {
    evaluateState(document.querySelectorAll("[x-state]"), "x-state");
    evaluateFetch(document.querySelectorAll("[x-fetch]"));
    evaluateEach(document.querySelectorAll("[x-each]"), "x-each", "x-state");
  };

  global.setState = setState;
}

export { initialize };
