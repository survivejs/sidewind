import { BindState, ExtendedHTMLElement } from "../types";
import evaluateBind from "./bind";
import evaluateAttributes from "./attributes";
import evaluateClasses from "./classes";
import evaluateEach from "./each";
import evaluateExpression from "../evaluate-expression";

type PromiseResult = { key: string; values: any };

function evaluateState(
  stateContainers: NodeListOf<ExtendedHTMLElement>,
  stateKey: string,
  bindKey: string,
  eachKey: string,
  attributeKey: string
) {
  for (let i = stateContainers.length; i--; ) {
    const stateContainer = stateContainers[i];

    const stateProperty = stateContainer.getAttribute(stateKey) || "";
    const state = stateContainer.state || evaluateExpression(stateProperty, {});

    let promises: Promise<PromiseResult>[] = [];
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

        stateContainer.setAttribute(stateKey, JSON.stringify(newState));
        stateContainer.state = newState;

        evaluateEach(
          stateContainer.querySelectorAll(`[${eachKey}]`),
          eachKey,
          stateKey
        );
        evaluateBind(stateContainer, newState, bindKey, stateKey);
        evaluateClasses(stateContainer, newState);
        evaluateAttributes(stateContainer, attributeKey, stateKey);
      });

    stateContainer.setAttribute(stateKey, JSON.stringify(state));
    stateContainer.state = state;

    evaluateBind(stateContainer, state, bindKey, stateKey);
    evaluateClasses(stateContainer, state);
    evaluateAttributes(stateContainer, attributeKey, stateKey);
  }
}

export default evaluateState;
