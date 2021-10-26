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
  const state = evaluate(expression, getState(element));
  const containerParent = element.parentElement;

  if (!state || !containerParent || typeof state !== "object") {
    return;
  }

  const initializedAlready = containerParent.children.length > 1;

  // Mark container parent as a boundary for x-recurse to copy
  containerParent.setAttribute("_x", "");

  const level = getParents(element, "x-recurse").length;

  // If we had initialized already, then it's important to update state
  // per each item and handle possible additions and removals
  if (initializedAlready) {
    let child = containerParent.firstElementChild
      ?.nextElementSibling as ExtendedHTMLElement;

    state.forEach((value: any) => {
      if (child) {
        // The actual state is stored to the object
        child.state = { value, level };

        evaluateDirectives(directives, child);

        child = child.nextElementSibling as ExtendedHTMLElement;
      }
    });
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

export default eachDirective;
