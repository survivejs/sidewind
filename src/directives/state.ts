import valueDirective from "./value";
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
    // @ts-ignore TODO: Fix the type
    element.state = evaluate(expression, getState(element));
  }

  if (element.observer) {
    return;
  }

  element.observer = new MutationObserver((mutations) => {
    const { target } = mutations[0];
    const hasStateItself = target.hasAttribute("x-state");

    // @ts-ignore
    const updatedTarget = target.attributes.getNamedItem("x-updated").value;
    const closestStateContainer = updatedTarget
      ? (target as ExtendedHTMLElement).closest(`[x-label="${updatedTarget}"]`)
      : hasStateItself
      ? target
      : (target as ExtendedHTMLElement).closest(`[x-state]`);

    if (!closestStateContainer) {
      console.warn("x-state - No state container was found", updatedTarget);
      return;
    }

    // Avoid recursion by not evaluating all directives
    const directivesWithoutSkipping = directives.filter(
      ({ directive }) => !directive.skipEvaluation
    );

    // Handle case where x-state has value as well separately
    // as evaluateDirectives doesn't evaluate parent itself
    // to avoid recursion.
    if (hasStateItself && target.hasAttribute("x")) {
      valueDirective({
        element: closestStateContainer,
        expression: closestStateContainer.getAttribute("x"),
        getState,
        evaluateDirectives,
        directives: directivesWithoutSkipping,
      });
    } else {
      evaluateDirectives(directivesWithoutSkipping, closestStateContainer);
    }
  });

  element.observer.observe(element, {
    attributeFilter: ["x-updated"],
    attributes: true,
    subtree: true,
  });
}
stateDirective.evaluateFrom = "top";

export default stateDirective;
