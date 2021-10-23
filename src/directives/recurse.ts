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
    const template = firstParent.nextElementSibling as ExtendedHTMLElement;

    // TODO: Get template instead!
    if (template) {
      const templateClone = template.cloneNode(true) as ExtendedHTMLElement;
      // const firstChild = templateClone.firstElementChild;

      // const templateElement = document.createElement("template");
      templateClone.setAttribute("x-each", "children");

      element.appendChild(templateClone);

      evaluateDirectives(directives, element);

      /*
      clone.setAttribute("x-state", JSON.stringify(state));

      // @ts-ignore
      // clone.state = { children: state };

      const templateElement = document.createElement("template");
      templateElement.setAttribute("x-each", "todos"); // TODO

      templateElement.appendChild(clone);
      element.appendChild(templateElement);

      evaluateDirectives(directives, templateElement as ExtendedHTMLElement);
      */
    }
  }

  // TODO: Find the closest parent with x-each, clone it and then apply
  // with the current state as its value
}

export default recurseDirective;
