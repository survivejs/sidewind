import { DirectiveParameters } from "../types";
// import { getValues } from "../utils";
// import setState from "../set-state";

function eachDirective({ element, getState }: DirectiveParameters) {
  const state = getState(element);

  if (state) {
    const containerParent = element.parentNode;

    if (!containerParent) {
      return;
    }

    // It would be better to diff for changes instead of replacing
    // all nodes.
    while (containerParent.firstChild) {
      containerParent.firstChild.remove();
    }
    containerParent.appendChild(element);

    /*
    if (typeof state === "object") {
      Object.values(getValues(state, expression)).forEach(
        values =>
          Array.isArray(values) &&
          values.forEach((value: any) => {
            const templateClone = document.importNode(element.content, true);
            const firstChild = templateClone.firstElementChild;

            firstChild.state = value;
            firstChild.setAttribute("x-state", "");
            containerParent.appendChild(templateClone);

            setState(value, firstChild);
          })
      );
    }
    */
  }
}

export default eachDirective;
