import { ExtendedHTMLElement } from "./types";
import {
  evaluateBind,
  evaluateClasses,
  evaluateEach,
  evaluateState,
} from "./directives";

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
  evaluateBind(stateContainer, updatedState, "x-bind", "x-state");
  evaluateClasses(stateContainer, updatedState);
  evaluateState(
    stateContainer.querySelectorAll("[x-state]"),
    "x-state",
    "x-bind",
    "x-each",
    "x-attr"
  );
}

export default setState;
