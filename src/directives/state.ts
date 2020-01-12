import { ExtendedHTMLElement } from "../types";
import evaluateClasses from "./classes";
import evaluateValues from "./values";
import { evaluateExpression } from "../evaluators";

function evaluateState(
  stateContainers: NodeListOf<ExtendedHTMLElement>,
  stateKey: string
) {
  for (let i = stateContainers.length; i--; ) {
    const stateContainer = stateContainers[i];

    const stateProperty = stateContainer.getAttribute(stateKey) || "";
    const state = evaluateExpression(stateProperty, {});

    stateContainer.state = state;

    evaluateValues(stateContainer, state, "x-value", "x-state");
    evaluateClasses(stateContainer, state);
  }
}

export default evaluateState;
