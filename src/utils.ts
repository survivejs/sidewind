import { BindState, ExtendedHTMLElement } from "./types";

function get(object: BindState, keyString: string) {
  const keys = keyString.split(".");
  let ret = object;

  keys.forEach(key => {
    ret = ret[key];
  });

  return ret;
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

function getValues(data: BindState, getter: string | null): BindState {
  if (!getter) {
    return {};
  }

  const value = data[getter];

  return {
    [getter]:
      value._type === "query"
        ? [].slice.call(document.querySelectorAll(value._value))
        : value,
  };
}

export { get, getLabeledState, getValues };
