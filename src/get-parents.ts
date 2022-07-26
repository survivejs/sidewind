import type { ExtendedHTMLElement } from "../types.ts";

function getParents(
  element: ExtendedHTMLElement,
  attribute: string
): ExtendedHTMLElement[] {
  const ret = [];
  let parent: ExtendedHTMLElement | null =
    element.parentElement as ExtendedHTMLElement;

  while (true) {
    if (!parent) {
      break;
    }

    if (parent.hasAttribute(attribute)) {
      ret.push(parent);
    }

    parent = parent.parentElement as ExtendedHTMLElement;
  }

  return ret;
}

export default getParents;
