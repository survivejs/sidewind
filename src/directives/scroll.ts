import { BindState, DirectiveParameters, ExtendedHTMLElement } from "../types";

// TODO: Communicate somehow this should be evaluated after value directive
// -> dependency declaration
function scrollDirective({
  element,
  expression,
  evaluate,
  setState,
}: DirectiveParameters) {
  const evaluateValue = () =>
    // @ts-ignore TODO: Fix the type
    evaluateScroll(
      element,
      // @ts-ignore TODO: Fix the type
      evaluate(expression, {}, element).state,
      setState
    );

  window.addEventListener("scroll", evaluateValue);

  evaluateValue();
}

function evaluateScroll(
  scrollContainer: ExtendedHTMLElement,
  scrollState: BindState,
  setState: DirectiveParameters["setState"]
) {
  setState(scrollState, { element: scrollContainer });
}

export default scrollDirective;
