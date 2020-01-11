import { ExtendedHTMLElement } from "../types";
import { evaluateExpression } from "../evaluators";

function evaluateInit(
  initContainers: NodeListOf<ExtendedHTMLElement>,
  initKey: string
) {
  for (let i = initContainers.length; i--; ) {
    const initContainer = initContainers[i];

    const initProperty = initContainer.getAttribute(initKey) || "";
    const evaluatedState = evaluateExpression(initProperty, {});

    initContainer.setAttribute("x-state", JSON.stringify(evaluatedState));
    initContainer.state = evaluatedState;
  }
}

export default evaluateInit;
