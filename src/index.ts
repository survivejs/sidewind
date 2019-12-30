import { ExtendedHTMLElement } from "./types";
import {
  evaluateClasses,
  evaluateEach,
  evaluateFetch,
  evaluateState,
  evaluateValues,
} from "./directives";
import { parseState } from "./parsers";

declare global {
  interface Window {
    setState: typeof setState;
  }
}

function setState(element: ExtendedHTMLElement, newValue: any) {
  const stateContainer = element.closest("[data-state]") as ExtendedHTMLElement;

  if (!stateContainer) {
    return;
  }

  const state = parseState(stateContainer);

  const updatedState =
    typeof state === "object" ? { ...state, ...newValue } : newValue;

  element.state = updatedState;

  stateContainer.dataset.state = JSON.stringify(updatedState);

  evaluateValues(stateContainer, updatedState, "value");
  evaluateClasses(stateContainer, updatedState);
  evaluateState(stateContainer.querySelectorAll("[data-state]"));
  evaluateEach(stateContainer.querySelectorAll("[data-each]"));
}

function initialize(global = window) {
  evaluateState(document.querySelectorAll("[data-state]"));
  evaluateFetch(document.querySelectorAll("[data-fetch]"));
  evaluateEach(document.querySelectorAll("[data-each]"));

  global.setState = setState;
}

export { initialize };
