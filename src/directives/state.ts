import { ExtendedHTMLElement } from "../types";
import { parseState } from "../parsers";
import evaluateClasses from "./classes";
import evaluateValues from "./values";

function evaluateState(stateContainers: NodeListOf<ExtendedHTMLElement>) {
  // It's important to perform state initialization parent-first since
  // state is nested and shadowed by children.
  const stateContainerOrder = orderByParents(Array.from(stateContainers));

  stateContainerOrder.forEach(i => {
    const stateContainer = stateContainers[i];
    const state = parseState(stateContainer);

    evaluateValues(stateContainer, state, "value");
    evaluateClasses(stateContainer, state);
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
