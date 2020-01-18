import { ExtendedHTMLElement } from "../types";
import evaluateExpression from "../evaluate-expression";
import setState from "../set-state";

function evaluateState(
  stateContainers: NodeListOf<ExtendedHTMLElement>,
  stateKey: string
) {
  // It's important to evaluate state containers from root to bottom
  // for nested state to work predictably.
  const stateContainerOrder = orderByParents(Array.from(stateContainers));

  stateContainerOrder.forEach(i => {
    const stateContainer = stateContainers[i];
    const stateProperty = stateContainer.getAttribute(stateKey) || "";

    setState(
      stateContainer.state || evaluateExpression(stateProperty),
      stateContainer
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
