import getParents from "../get-parents";
import type { DirectiveParameters, ExtendedHTMLElement } from "../types";

function eachDirective({
  element,
  expression,
  evaluate,
  getState,
  evaluateDirectives,
  directives,
}: DirectiveParameters) {
  const state = evaluate(expression, getState(element)) || [];
  const containerParent = element.parentElement as ExtendedHTMLElement;

  if (!containerParent) {
    return;
  }

  if (state === containerParent.state) {
    return;
  }
  // Stash state so it can be compared later to avoid work
  containerParent.state = state;

  const initializedAlready = containerParent.children.length > 1;

  // Mark container parent as a boundary for x-recurse to copy
  containerParent.setAttribute("_x", "");

  const level = getParents(element, "x-recurse").length;

  if (initializedAlready) {
    const amountOfItems = state.length;

    // Subtract template
    const amountOfChildren = containerParent.children.length - 1;

    // Create missing nodes
    if (amountOfItems > amountOfChildren) {
      for (let i = 0; i < amountOfItems - amountOfChildren; i++) {
        const templateClone = document.importNode(element.content, true);
        containerParent.appendChild(templateClone.firstElementChild);
      }
    }
    // Remove extra nodes
    if (amountOfItems < amountOfChildren) {
      for (let i = 0; i < amountOfChildren - amountOfItems; i++) {
        containerParent.lastChild?.remove();
      }
    }

    let child = containerParent.firstElementChild
      ?.nextElementSibling as ExtendedHTMLElement;

    state.forEach((value: any) => {
      if (child) {
        child.setAttribute("x-state", "");
        // The actual state is stored to the object
        child.state = { value, level };

        const children = findFirstChildrenWith(child, "TEMPLATE");

        children.forEach((child) => {
          if (child.parentElement) {
            (child.parentElement as ExtendedHTMLElement).state = state;
          }
        });

        evaluateDirectives(directives, child);

        child = child.nextElementSibling as ExtendedHTMLElement;
      }
    });

    if (child && state.length === 0) {
      child.remove();
    }
    // Otherwise we'll set up the initial DOM structure based on a template
    // and populate it with data that's then evaluated.
  } else {
    state.forEach((value: any) => {
      const templateClone = document.importNode(element.content, true);
      const firstChild = templateClone.firstElementChild;
      containerParent.appendChild(templateClone);

      let child = firstChild;

      do {
        if (child) {
          // The element should be a state container itself
          child.setAttribute("x-state", "");
          // The actual state is stored to the object
          child.state = { value, level };

          evaluateDirectives(directives, child);
        }
      } while ((child = child?.nextElementSibling));
    });
  }
}
eachDirective.evaluateFrom = "top";

function findFirstChildrenWith(element: Element, tagName: string) {
  let ret: ExtendedHTMLElement[] = [];

  function recurse(element: Element) {
    let child = element.firstElementChild;

    do {
      if (child?.tagName === tagName) {
        ret.push(child as ExtendedHTMLElement);
      } else if (child?.children.length) {
        recurse(child);
      }
    } while ((child = child?.nextElementSibling || null));
  }

  recurse(element);

  return ret;
}

export default eachDirective;
