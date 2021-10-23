import { DirectiveParameters, ExtendedHTMLElement } from "../types";
import getParents from "../get-parents";

function recurseDirective({
  element,
  expression,
  evaluateDirectives,
  directives,
}: DirectiveParameters) {
  const parents = getParents(element, "_x");
  const firstParent = parents[0];
  const template = firstParent.nextElementSibling as ExtendedHTMLElement;

  if (template) {
    const templateClone = template.cloneNode(true) as ExtendedHTMLElement;

    templateClone.setAttribute("x-each", expression);

    element.appendChild(templateClone);

    evaluateDirectives(directives, element);
  }
}

export default recurseDirective;
