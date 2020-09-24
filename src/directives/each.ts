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

  Object.values(getValues(state, expression)).forEach(
    (values) =>
      Array.isArray(values) &&
      values.forEach((value: any) => {
        const templateClone = document.importNode(element.content, true);
        const firstChild = templateClone.firstElementChild;

        // The element should be a state container itself
        firstChild.setAttribute("x-state", JSON.stringify(value));
        firstChild.state = value;

        containerParent.appendChild(templateClone);
        evaluateDirectives(directives, firstChild);
      })
  );

  containerParent.appendChild(element);
}

export default eachDirective;
