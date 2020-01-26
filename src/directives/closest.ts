import { BindState, DirectiveParameters, ExtendedHTMLElement } from "../types";
import { getValues } from "../utils";

function closestDirective({
  element,
  expression,
  evaluate,
  setState,
}: DirectiveParameters) {
  const { state } = evaluate(expression);
  const key = Object.keys(state)[0];

  window.addEventListener("scroll", () =>
    evaluateClosestValue(element, evaluate(expression).state, key, setState)
  );
}

function evaluateClosestValue(
  closestContainer: ExtendedHTMLElement,
  closestState: BindState,
  key: string,
  setState: DirectiveParameters["setState"]
) {
  const elements = Array.from(getValues(closestState, key)[key]).map(value => {
    const element = value as HTMLElement;
    const { top } = element.getBoundingClientRect();

    return {
      element,
      top,
    };
  });

  if (!elements || elements.length < 1) {
    return;
  }

  const closest = elements.reduce((a, b) =>
    Math.abs(a.top) < Math.abs(b.top) ? a : b
  );

  setState({ [key]: closest.element }, closestContainer);
}

export default closestDirective;
