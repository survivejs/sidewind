import type { BindState, ExtendedHTMLElement } from "../types.ts";
import getParents from "./get-parents.ts";

function getState<State = Record<string, unknown>>(
  element: HTMLElement
): State | undefined {
  const closestStateContainer = element.hasAttribute("x-state")
    ? element
    : element.closest("[x-state]");

  if (!closestStateContainer) {
    return;
  }

  // @ts-ignore How to type this?
  const { state }: { state: State } = closestStateContainer;
  const labeledState = getLabeledState(element, "x-label");

  // @ts-ignore How to type this? Likely labels need more definition
  return Object.assign({}, labeledState, { state });
}

function getLabeledState(element: HTMLElement, labelKey: string) {
  const labeledStateContainers = getParents(element, labelKey).concat(
    element.hasAttribute("x-label") ? element : []
  );
  const ret: BindState = {};

  for (let i = labeledStateContainers.length; i--; ) {
    const labeledStateContainer = labeledStateContainers[
      i
    ] as ExtendedHTMLElement;
    const label = labeledStateContainer.getAttribute(labelKey);

    if (label) {
      ret[label] = labeledStateContainer.state;
    }
  }

  return ret;
}

export default getState;
