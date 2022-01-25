import { DirectiveParameters, ExtendedHTMLElement } from "../types";

function stateDirective({
  element,
  expression,
  evaluate,
  evaluateDirectives,
  directives,
  getState,
}: DirectiveParameters) {
  // State has to be evaluated regardless for derivations to work.
  //
  // x-each is a special case as it maintains state directly. Potentially
  // this could be changed to break the coupling.
  if (expression || typeof element.state === "undefined") {
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

    evaluateDirectives(directivesWithoutSkipping, closestStateContainer);
  });

  element.observer.observe(element, {
    attributeFilter: ["x-updated"],
    attributes: true,
    subtree: true,
  });
}
stateDirective.evaluateFrom = "top";

export default stateDirective;
