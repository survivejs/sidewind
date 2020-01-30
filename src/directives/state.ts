import { DirectiveParameters, ExtendedHTMLElement } from "../types";

function stateDirective({
  element,
  expression,
  evaluate,
  evaluateDirectives,
  directives,
}: DirectiveParameters) {
  element.state = evaluate(expression);

  const observer = new MutationObserver(mutations => {
    const { attributeName, target } = mutations[0];
    const closestStateContainer = (target as ExtendedHTMLElement).closest(
      `[x-state]`
    );

    // If triggered by something else than setState, skip.
    if (attributeName !== "x-updated" || closestStateContainer !== element) {
      return;
    }

    // Avoid recursion by not evaluating all directives
    const directivesWithoutSkipping = directives.filter(
      ({ directive }) => !directive.skipEvaluation
    );

    evaluateDirectives(directivesWithoutSkipping, element);
  });

  observer.observe(element, { attributes: true, subtree: true });
}

export default stateDirective;
