import { BindState, ExtendedHTMLElement } from "./types";
import getParents from "./get-parents";

function getState(element: ExtendedHTMLElement) {
  if (!element) {
    return {};
  }

  const closestStateContainer = element.closest(
    `[x-state]`
  ) as ExtendedHTMLElement;
  const { state }: { state: BindState } = closestStateContainer;
  const labeledState = getLabeledState(element, "x-label");

  return Object.assign({}, labeledState, { state });
}

function getLabeledState(element: ExtendedHTMLElement, labelKey: string) {
  const labeledStateContainers = getParents(element, labelKey);
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
