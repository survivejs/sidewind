import { DirectiveParameters } from "../types";

function stateDirective({
  element,
  expression,
  evaluate,
  evaluateDirectives,
  directives,
}: DirectiveParameters) {
  element.state = evaluate(expression);

  const observer = new MutationObserver(mutations => {
    const attributeName = mutations[0].attributeName;

    // If triggered by something else than setState, skip.
    if (attributeName !== "x-updated") {
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
