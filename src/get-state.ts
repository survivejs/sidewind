import { BindState, ExtendedHTMLElement } from "./types";
import getParents from "./get-parents";

function getState<State = Record<string, unknown>>(
  element: ExtendedHTMLElement,
): State | undefined {
  const closestStateContainer = element.closest(
    "[x-state]",
  ) as ExtendedHTMLElement;

  if (!closestStateContainer) {
    return;
  }

  // @ts-ignore How to type this?
  const { state }: { state: State } = closestStateContainer;
  const labeledState = getLabeledState(element, "x-label");

  // @ts-ignore How to type this? Likely labels need more definition
  return Object.assign({}, labeledState, { state });
}

function getLabeledState(element: ExtendedHTMLElement, labelKey: string) {
  const labeledStateContainers = getParents(element, labelKey);
  const ret: BindState = {};

  for (let i = labeledStateContainers.length; i--;) {
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
