import { DirectiveParameters, ExtendedHTMLElement } from "../types";

function stateDirective({
  element,
  expression,
  evaluate,
  evaluateDirectives,
  directives,
  getState,
}: DirectiveParameters) {
  if (!element.state) {
    element.state = evaluate(expression, getState(element));
  }

  if (element.observer) {
    return;
  }

  element.observer = new MutationObserver((mutations) => {
    const { target } = mutations[0];

    // @ts-ignore
    const updatedTarget = target.attributes.getNamedItem("x-updated").value;
    const closestStateContainer = updatedTarget
      ? (target as ExtendedHTMLElement).closest(`[x-label="${updatedTarget}"]`)
      : (target as ExtendedHTMLElement).closest(`[x-state]`);

    if (!updatedTarget && closestStateContainer !== element) {
      return;
    }

    // Avoid recursion by not evaluating all directives
    const directivesWithoutSkipping = directives.filter(
      ({ directive }) => !directive.skipEvaluation
    );

    // @ts-ignore
    evaluateDirectives(directivesWithoutSkipping, closestStateContainer);
  });

  element.observer.observe(element, {
    attributeFilter: ["x-updated"],
    attributes: true,
    subtree: true,
  });
}

export default stateDirective;
