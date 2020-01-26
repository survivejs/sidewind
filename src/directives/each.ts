import { DirectiveParameters } from "../types";
import { getValues } from "../utils";

function eachDirective({
  element,
  expression,
  getState,
  setState,
}: DirectiveParameters) {
  const { state } = getState(element);

  if (state) {
    const containerParent = element.parentNode;

    if (!containerParent) {
      return;
    }

    if (typeof state === "object") {
      // It would be better to diff for changes instead of replacing
      // all nodes.
      while (containerParent.firstChild) {
        containerParent.firstChild.remove();
      }

      Object.values(getValues(state, expression)).forEach(
        values =>
          Array.isArray(values) &&
          values.forEach((value: any) => {
            const templateClone = document.importNode(element.content, true);
            const firstChild = templateClone.firstElementChild;

            // The element should be a state container itself
            firstChild.setAttribute("x-state", "");

            containerParent.appendChild(templateClone);
            setState(value, firstChild);
          })
      );

      // Append last to trigger mutation observer only once
      containerParent.appendChild(element);
    }
  }
}

export default eachDirective;
