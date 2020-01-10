import { ExtendedHTMLElement } from "../types";
import { parseState } from "../parsers";
import evaluateClasses from "./classes";
import evaluateValues from "./values";

function evaluateState(stateContainers: NodeListOf<ExtendedHTMLElement>) {
  for (let i = stateContainers.length; i--; ) {
    const stateContainer = stateContainers[i];
    const state = parseState(stateContainer);

    // x-each relies on this. Is this a good dependency to have?
    stateContainer.state = state;

    evaluateValues(stateContainer, state, "x-value", "x-state");
    evaluateClasses(stateContainer, state);
  }
}

export default evaluateState;
