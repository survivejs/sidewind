import { DirectiveParameters, ExtendedHTMLElement } from "../types";

function stateDirective({
  element,
  expression,
  evaluate,
  // setState,
  evaluateDirectives,
  directives,
}: DirectiveParameters) {
  // setState(element.state || evaluate(expression), element);

  element.state = evaluate(expression);

  const observer = new MutationObserver(() => {
    // Avoid recursion by not evaluating all directives
    const directivesWithoutState = directives.filter(
      ({ directive }) => !directive.skipEvaluation
    );

    evaluateDirectives(directivesWithoutState, element);
  });

  observer.observe(element, { attributes: true, subtree: true });
}
stateDirective.skipEvaluation = true;
stateDirective.resolveElements = (elements: NodeListOf<Element>) =>
  orderByParents(Array.from(elements as NodeListOf<ExtendedHTMLElement>));

function orderByParents(elementsArray: ExtendedHTMLElement[]) {
  // Note that sort mutates the original structure directly
  return elementsArray
    .map(element => ({
      element,
      depth: getDepth(element),
    }))
    .sort((a, b) => a.depth - b.depth)
    .map(({ element }) => element);
}

function getDepth(element: Node, depth = 0): number {
  return element.parentNode ? getDepth(element.parentNode, depth + 1) : depth;
}

export default stateDirective;
