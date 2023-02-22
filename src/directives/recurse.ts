import getParents from "../get-parents.ts";
import type { DirectiveParameters, ExtendedHTMLElement } from "../../types.ts";

function recurseDirective({
  element,
  expression,
  evaluate,
  getState,
  evaluateDirectives,
  directives,
}: DirectiveParameters) {
  // @ts-ignore TODO: Fix the type
  const state = evaluate(expression, getState(element));
  let parentIndex = 0;
  let value = expression;

  if (state.parentIndex && state.value) {
    parentIndex = state.parentIndex;
    value = state.value;
  } else if (!Array.isArray(state)) {
    return;
  }

  const hasEachAlready = element.getAttribute("x-each");

  if (hasEachAlready) {
    return;
  }

  const parents = getParents(element, "_x-template");
  const template = parents[parentIndex];

  if (!template) {
    console.error("x-recurse - Parent x-template was not found");

    return;
  }

  const templateClone = template.cloneNode(true) as ExtendedHTMLElement;
  templateClone.setAttribute("x-template", "");

  element.appendChild(templateClone);

  // @ts-ignore TODO: Fix the type
  element.setAttribute("x-each", value);

  // Evaluate against parent since the element itself contains x-each
  evaluateDirectives(directives, element.parentElement as ExtendedHTMLElement);
}

export default recurseDirective;
