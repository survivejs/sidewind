import { ExtendedHTMLElement } from "./types";
import { evaluateAttributes, evaluateEach, evaluateState } from "./directives";

function setState(newValue: any, element?: ExtendedHTMLElement) {
  const stateKey = "x-state";
  const eachKey = "x-each";
  const attributeKey = "x-attr";
  const labelKey = "x-label";
  const valueKey = "x:";

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
  evaluateState(
    stateContainer.querySelectorAll(`[${stateKey}]`),
    stateKey,
    eachKey,
    attributeKey,
    labelKey,
    valueKey
  );
  evaluateAttributes(
    stateContainer,
    attributeKey,
    stateKey,
    labelKey,
    valueKey
  );
}

export default setState;
