import { BindState, DirectiveParameters, ExtendedHTMLElement } from "../types";
import evaluateExpression from "../evaluate-expression";
import { getValues } from "../utils";

function closestDirective({
  element,
  expression,
  parameters: { state },
  setState,
}: DirectiveParameters) {
  const key = Object.keys(state)[0];

  // TODO: Eliminate somehow - should setState handle this?
  const initialState = evaluateExpression(
    element.getAttribute("x-state") || ""
  );
  element.setAttribute(
    "x-state",
    JSON.stringify(
      initialState ? { ...initialState, [key]: "" } : { [key]: "" }
    )
  );

  window.addEventListener("scroll", () =>
    evaluateClosestValue(
      element,
      evaluateExpression(expression).state,
      key,
      setState
    )
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
