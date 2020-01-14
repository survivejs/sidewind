import { ExtendedHTMLElement } from "./types";
import {
  evaluateBind,
  evaluateClasses,
  evaluateEach,
  evaluateState,
} from "./directives";

function setState(newValue: any, element?: ExtendedHTMLElement) {
  const stateKey = "x-state";
  const eachKey = "x-each";
  const bindKey = "x-bind";
  const attrKey = "x-attr";
  const labelKey = "x-label";

  if (!element) {
    element = window.event && (window.event.target as ExtendedHTMLElement);

    if (!element) {
      return;
    }
  }

  const stateContainer = element.closest(
    `[${stateKey}]`
  ) as ExtendedHTMLElement;

  if (!stateContainer) {
    return;
  }

  const state = stateContainer.state;
  const updatedState =
    typeof state === "object" ? { ...state, ...newValue } : newValue;

  element.state = updatedState;

  stateContainer.setAttribute(stateKey, JSON.stringify(updatedState));
  stateContainer.state = updatedState;

  evaluateEach(
    stateContainer.querySelectorAll(`[${eachKey}]`),
    eachKey,
    stateKey
  );
  evaluateBind(stateContainer, updatedState, bindKey, stateKey);
  evaluateState(
    stateContainer.querySelectorAll(`[${stateKey}]`),
    stateKey,
    bindKey,
    eachKey,
    attrKey,
    labelKey
  );
  evaluateClasses(stateContainer, stateKey, labelKey);
}

export default setState;
