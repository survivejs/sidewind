import { ExtendedHTMLElement } from "./types";
import { evaluateAttributes, evaluateEach, evaluateState } from "./directives";
import directiveKeys from "./directive-keys";

function setState(newValue: any, element?: ExtendedHTMLElement) {
  if (!element) {
    element = window.event && (window.event.target as ExtendedHTMLElement);

    if (!element) {
      return;
    }
  }

  const stateContainer = element.closest(
    `[${directiveKeys.state}]`
  ) as ExtendedHTMLElement;

  if (!stateContainer) {
    return;
  }

  const state = stateContainer.state;
  const updatedState =
    typeof state === "object" ? { ...state, ...newValue } : newValue;

  element.state = updatedState;

  stateContainer.setAttribute(
    directiveKeys.state,
    JSON.stringify(updatedState)
  );
  stateContainer.state = updatedState;

  evaluateEach(
    stateContainer.querySelectorAll(`[${directiveKeys.each}]`),
    directiveKeys.each,
    directiveKeys.state
  );
  evaluateState(
    stateContainer.querySelectorAll(`[${directiveKeys.state}]`),
    directiveKeys.state,
    directiveKeys.each,
    directiveKeys.attr,
    directiveKeys.label,
    directiveKeys.x
  );
  evaluateAttributes(
    stateContainer,
    directiveKeys.attr,
    directiveKeys.state,
    directiveKeys.label,
    directiveKeys.x
  );
}

export default setState;
