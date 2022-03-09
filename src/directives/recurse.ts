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
    console.error(
      "x-recurse - Evaluated expression does not yield an array",
      expression,
      element,
      getState(element)
    );

    return;
  }

  const hasEachAlready = element.getAttribute("x-each");

  if (hasEachAlready) {
    return;
  }

  const parents = getParents(element, "x-template");
  const template = parents[0];

  if (!template) {
    console.error("x-recurse - Parent x-template was not found");

    return;
  }

  const templateClone = template.cloneNode(true) as ExtendedHTMLElement;

  element.appendChild(templateClone);
  element.setAttribute("x-each", expression);

  evaluateDirectives(directives, element);
}

export default recurseDirective;
