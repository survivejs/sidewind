import { BindState, ExtendedHTMLElement } from "../types";
import evaluateAttributes from "./attributes";
import evaluateEach from "./each";
import evaluateExpression from "../evaluate-expression";

type PromiseResult = { key: string; values: any };

function evaluateState(
  stateContainers: NodeListOf<ExtendedHTMLElement>,
  stateKey: string,
  eachKey: string,
  attributeKey: string,
  labelKey: string,
  valueKey: string
) {
  // It's important to evaluate state containers from root to bottom
  // for nested state to work predictably.
  const stateContainerOrder = orderByParents(Array.from(stateContainers));

  stateContainerOrder.forEach(i => {
    const stateContainer = stateContainers[i];
    const stateProperty = stateContainer.getAttribute(stateKey) || "";
    const state = stateContainer.state || evaluateExpression(stateProperty);

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
        evaluateAttributes(
          stateContainer,
          attributeKey,
          stateKey,
          labelKey,
          valueKey
        );
      });

    stateContainer.setAttribute(stateKey, JSON.stringify(state));
    stateContainer.state = state;

    evaluateAttributes(
      stateContainer,
      attributeKey,
      stateKey,
      labelKey,
      valueKey
    );
  });
}

function orderByParents(elementsArray: ExtendedHTMLElement[]) {
  // Note that sort mutates the original structure directly
  return elementsArray
    .map((element, i) => ({
      i,
      depth: getDepth(element),
    }))
    .sort((a, b) => a.depth - b.depth)
    .map(({ i }) => i);
}

function getDepth(element: Node, depth = 0): number {
  return element.parentNode ? getDepth(element.parentNode, depth + 1) : depth;
}

export default evaluateState;
