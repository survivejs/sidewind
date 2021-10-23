import { DirectiveParameters, ExtendedHTMLElement } from "../types";
import getParents from "../get-parents";

function recurseDirective({
  element,
  expression,
  evaluate,
  getState,
  evaluateDirectives,
  directives,
}: DirectiveParameters) {
  const state = evaluate(expression, getState(element));

  if (state) {
    const parents = getParents(element, "_x");
    const firstParent = parents[0];

    if (firstParent) {
      console.log("recurse", state, firstParent);

      const clone = (firstParent.cloneNode(true) as Element).firstElementChild;

      if (!clone) {
        return;
      }

      clone.setAttribute("x-state", JSON.stringify(state));

      // @ts-ignore
      // clone.state = { children: state };

      const templateElement = document.createElement("template");
      templateElement.setAttribute("x-each", "todos"); // TODO

      templateElement.appendChild(clone);
      element.appendChild(templateElement);

      evaluateDirectives(directives, templateElement as ExtendedHTMLElement);
    }
  }

  // TODO: Find the closest parent with x-each, clone it and then apply
  // with the current state as its value
}

export default recurseDirective;
