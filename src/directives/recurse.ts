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

    if (template) {
      const templateClone = template.cloneNode(true) as ExtendedHTMLElement;

      // TODO: Figure out how to resolve to this or change the interface somehow
      templateClone.setAttribute("x-each", "children");

      element.appendChild(templateClone);

      evaluateDirectives(directives, element);
    }
  }
}

export default recurseDirective;
