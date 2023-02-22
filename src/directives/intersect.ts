import type { DirectiveParameters } from "../../types.ts";

function intersectDirective({
  element,
  expression,
  evaluateDirectives,
  directives,
  evaluate,
  setState,
}: DirectiveParameters) {
  // @ts-ignore TODO: Fix the type
  const { options = {} } = evaluate(expression);

  let triggered = false;
  const observer = new IntersectionObserver(
    (entries) => {
      if (options.once && triggered) {
        return;
      }

      // https://stackoverflow.com/questions/53214116/intersectionobserver-callback-firing-immediately-on-page-load
      const intersected = entries.some((entry) => {
        return entry.intersectionRatio > 0;
      });

      if (!intersected) {
        return;
      }

      triggered = true;

      // @ts-ignore TODO: Fix the type
      setState(evaluate(expression).state, { element });

      // Evaluate directives from the element parent to allow setting state to
      // x-intersected element itself.
      // Most likely this should be solved in another way at a higher level.
      const directivesWithoutSkipping = directives.filter(
        ({ directive }) => !directive.skipEvaluation
      );

      // @ts-ignore
      evaluateDirectives(directivesWithoutSkipping, element.parentElement);
    },
    Object.assign(
      {},
      {
        rootMargin: "0px",
        threshold: 1.0,
      },
      options
    )
  );
  observer.observe(element);
}
intersectDirective.skipEvaluation = true;

export default intersectDirective;
