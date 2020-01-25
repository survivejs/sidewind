import { BindState, ExtendedHTMLElement } from "./types";
import { evaluateEach } from "./directives";
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
  const updatedState = isObject(state) ? { ...state, ...newValue } : newValue;

  element.state = updatedState;
  stateContainer.state = updatedState;

  let promises: { key: string; promise: Promise<PromiseResult> }[] = [];
  isObject(updatedState) &&
    Object.keys(updatedState).forEach(key => {
      const v = updatedState[key];

      if (v && v.then) {
        promises.push({
          key,
          promise: v.then((values: any) => ({ key, values })),
        });
      }
    });

  if (promises.length > 0) {
    const newState: BindState = {};

    promises.forEach(({ key }) => {
      newState[key] = { status: "loading" };
    });

    stateContainer.state = { ...stateContainer.state, ...newState };
    evaluate(stateContainer);

    Promise.all(promises.map(({ promise }) => promise)).then(values => {
      const promisedState: BindState = {};

      values.forEach(({ key, values }: PromiseResult) => {
        promisedState[key] = values;
      });

      const newState = { ...stateContainer.state, ...promisedState };

      stateContainer.state = newState;
      evaluate(stateContainer);
    });
  }

  generateAttributeKeys(
    [stateContainer],
    directiveKeys.attribute,
    directiveKeys.value
  );
  evaluate(stateContainer);
}

function evaluate(stateContainer: ExtendedHTMLElement) {
  evaluateEach(
    stateContainer.querySelectorAll(`[${directiveKeys.each}]`),
    directiveKeys.each,
    directiveKeys.state
  );
}

function isObject(obj: any) {
  return typeof obj === "object" && obj && !obj.nodeName;
}

export default setState;
