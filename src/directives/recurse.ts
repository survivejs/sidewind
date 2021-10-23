import { DirectiveParameters, ExtendedHTMLElement } from "../types";
import getParents from "../get-parents";

function recurseDirective({
  element,
  evaluateDirectives,
  directives,
}: DirectiveParameters) {
  const parents = getParents(element, "_x");
  const firstParent = parents[0];
  const template = firstParent.nextElementSibling as ExtendedHTMLElement;

  if (template) {
    const templateClone = template.cloneNode(true) as ExtendedHTMLElement;

    // TODO: This should use the expression
    templateClone.setAttribute("x-each", "children");

    element.appendChild(templateClone);

    evaluateDirectives(directives, element);
  }
}

export default recurseDirective;
