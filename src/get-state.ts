import { BindState, ExtendedHTMLElement } from "./types";

function getState(element: ExtendedHTMLElement) {
  const closestStateContainer = element.closest(
    `[x-state]`
  ) as ExtendedHTMLElement;
  const { state }: { state: BindState } = closestStateContainer;
  const labeledState = getLabeledState(element, "x-label");

  // TODO: Handle querySelectorAll expansion here?
  return { ...labeledState, state };
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

function getParents(element: HTMLElement, attribute: string) {
  const ret = [];
  let parent: HTMLElement | null = element.parentElement;

  while (true) {
    if (!parent) {
      break;
    }

    if (parent.hasAttribute(attribute)) {
      ret.push(parent);
    }

    parent = parent.parentElement;
  }

  return ret;
}

export default getState;
