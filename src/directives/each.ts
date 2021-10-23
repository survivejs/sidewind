import { DirectiveParameters } from "../types";
import { getValues } from "../utils";

function eachDirective({
  element,
  expression,
  getState,
  evaluateDirectives,
  directives,
}: DirectiveParameters) {
  const { state } = getState(element);
  const containerParent = element.parentNode;

  if (!state || !containerParent || typeof state !== "object") {
    return;
  }

  // It would be better to diff for changes instead of replacing
  // all nodes.
  while (containerParent.firstChild) {
    containerParent.firstChild.remove();
  }

  // Create a boundary for x-recurse to copy
  const eachBoundary = document.createElement("div");
  eachBoundary.setAttribute("_x", "");
  containerParent.appendChild(eachBoundary);

  console.log("x-each", state, expression);

  Object.values(getValues(state, expression)).forEach(
    (values) =>
      Array.isArray(values) &&
      values.forEach((value: any) => {
        const templateClone = document.importNode(element.content, true);
        const firstChild = templateClone.firstElementChild;

        let child = firstChild;
        do {
          if (child) {
            // The element should be a state container itself
            child.setAttribute("x-state", JSON.stringify(value));
            child.state = value;
          }
        } while ((child = child?.nextElementSibling));

        eachBoundary.appendChild(templateClone);

        child = firstChild;
        do {
          evaluateDirectives(directives, child);
        } while ((child = child?.nextElementSibling));
      })
  );

  containerParent.appendChild(element);
}

export default eachDirective;
