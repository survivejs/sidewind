import { BindState, ExtendedHTMLElement } from "./types";
import { evaluateAttributes, evaluateEach, evaluateState } from "./directives";
import directiveKeys from "./directive-keys";
import generateAttributeKeys from "./generate-attribute-keys";

type PromiseResult = { key: string; values: any };

function setState(newValue: any, element?: ExtendedHTMLElement) {
  if (!element) {
    element = window.event && (window.event.target as ExtendedHTMLElement);

    if (!element) {
      return;
    }
  }

  let stateContainer = element.hasAttribute(directiveKeys.state)
    ? element
    : (element.closest(`[${directiveKeys.state}]`) as ExtendedHTMLElement);

  if (!stateContainer) {
    return;
  }

  const state = stateContainer.state;

  let promises: Promise<PromiseResult>[] = [];
  typeof state === "object" &&
    Object.keys(state).forEach(key => {
      const v = state[key];

      if (v.then) {
        promises.push(v.then((values: any) => ({ key, values })));
      }
    });

  promises.length > 0 &&
    Promise.all(promises).then(values => {
      const promisedState: BindState = {};

      values.forEach(({ key, values }: PromiseResult) => {
        promisedState[key] = values;
      });

      const newState = { ...stateContainer.state, ...promisedState };

      stateContainer.state = newState;

      evaluateEach(
        stateContainer.querySelectorAll(`[${directiveKeys.each}]`),
        directiveKeys.each,
        directiveKeys.state
      );
      evaluateAttributes(
        stateContainer,
        directiveKeys.attribute,
        directiveKeys.state,
        directiveKeys.label,
        directiveKeys.value
      );
    });

  const updatedState =
    typeof state === "object" && state && !state.nodeName
      ? { ...state, ...newValue }
      : newValue;

  element.state = updatedState;
  stateContainer.state = updatedState;

  generateAttributeKeys(
    [stateContainer],
    directiveKeys.attribute,
    directiveKeys.value
  );
  evaluateEach(
    stateContainer.querySelectorAll(`[${directiveKeys.each}]`),
    directiveKeys.each,
    directiveKeys.state
  );
  evaluateState(
    stateContainer.querySelectorAll(`[${directiveKeys.state}]`),
    directiveKeys.state
  );
  evaluateAttributes(
    stateContainer,
    directiveKeys.attribute,
    directiveKeys.state,
    directiveKeys.label,
    directiveKeys.value
  );
}

export default setState;
