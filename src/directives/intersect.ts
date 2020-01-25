import { DirectiveParameters } from "../types";
import evaluateExpression from "../evaluate-expression";

function intersectDirective({
  element,
  expression,
  parameters: { options = {}, state },
  setState,
}: DirectiveParameters) {
  // TODO: Eliminate somehow - should setState handle this?
  const key = Object.keys(state)[0];
  const emptyIntersect = { [key]: "" };
  const initialState = evaluateExpression(
    element.getAttribute("x-state") || ""
  );
  element.setAttribute(
    "x-state",
    JSON.stringify(
      initialState ? { ...initialState, ...emptyIntersect } : emptyIntersect
    )
  );

  let triggered = false;
  const observer = new IntersectionObserver(
    entries => {
      if (options.once && triggered) {
        return;
      }

      // https://stackoverflow.com/questions/53214116/intersectionobserver-callback-firing-immediately-on-page-load
      const intersected = entries.some(entry => {
        return entry.intersectionRatio > 0;
      });

      if (!intersected) {
        return;
      }

      triggered = true;

      setState(evaluateExpression(expression).state, element);
    },
    {
      rootMargin: "0px",
      threshold: 1.0,
      ...options,
    }
  );
  observer.observe(element);
}

export default intersectDirective;
