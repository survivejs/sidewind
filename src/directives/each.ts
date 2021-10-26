import getParents from "../get-parents";
import type { DirectiveParameters } from "../types";

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

  if (containerParent.children.length > 1) {
    return;
  }

  // Mark container parent as a boundary for x-recurse to copy
  containerParent.setAttribute("_x", "");

  const level = getParents(element, "x-recurse").length;

  state.forEach((value: any) => {
    const templateClone = document.importNode(element.content, true);
    const firstChild = templateClone.firstElementChild;

    let child = firstChild;
    do {
      if (child) {
        // TODO: Find a better way to pass _level
        value._level = level;

        // The element should be a state container itself
        child.setAttribute("x-state", JSON.stringify(value));
        child.state = value;
      }
    } while ((child = child?.nextElementSibling));

    containerParent.appendChild(templateClone);

    child = firstChild;
    do {
      evaluateDirectives(directives, child);
    } while ((child = child?.nextElementSibling));
  });
}

export default eachDirective;
