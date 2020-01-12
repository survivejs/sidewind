import { BindState, ExtendedHTMLElement } from "../types";
import evaluateClasses from "./classes";
import evaluateEach from "./each";
import evaluateValues from "./values";
import { evaluateExpression } from "../evaluators";

type PromiseResult = { key: string; values: any };

function evaluateState(
  stateContainers: NodeListOf<ExtendedHTMLElement>,
  stateKey: string
) {
  for (let i = stateContainers.length; i--; ) {
    const stateContainer = stateContainers[i];

    const stateProperty = stateContainer.getAttribute(stateKey) || "";
    const state = evaluateExpression(stateProperty, {});

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

        stateContainer.state = newState;

        evaluateValues(stateContainer, newState, "x-value", "x-state");
        evaluateClasses(stateContainer, newState);
        evaluateEach(
          stateContainer.querySelectorAll("[x-each]"),
          "x-each",
          "x-state"
        );
      });

    stateContainer.state = state;

    evaluateValues(stateContainer, state, "x-value", "x-state");
    evaluateClasses(stateContainer, state);
  }
}

export default evaluateState;
