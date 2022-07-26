function getParents(element: HTMLElement, attribute: string): HTMLElement[] {
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

export default getParents;
