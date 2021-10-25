import { DirectiveParameters } from "../types";
import getParents from "../get-parents";

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

  // It would be better to diff for changes instead of replacing
  // all nodes.
  while (containerParent.firstChild) {
    containerParent.firstChild.remove();
  }

  // Mark container parent as a boundary for x-recurse to copy
  containerParent.setAttribute("_x", "");
  containerParent.appendChild(element);

  const level = getParents(element, "x-recurse").length;

  state.forEach((value: any) => {
    const templateClone = document.importNode(element.content, true);
    const firstChild = templateClone.firstElementChild;

    let child = firstChild;
    do {
      if (child) {
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
