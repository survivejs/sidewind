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

  if (!Array.isArray(state)) {
    return;
  }

  const parents = getParents(element, "_x");
  const firstParent = parents[0];
  const template = firstParent.firstElementChild as ExtendedHTMLElement;

  if (template) {
    const templateClone = template.cloneNode(true) as ExtendedHTMLElement;

    templateClone.setAttribute("x-each", expression);

    element.appendChild(templateClone);

    evaluateDirectives(directives, element);
  }
}

export default recurseDirective;
