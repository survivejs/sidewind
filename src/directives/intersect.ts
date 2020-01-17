import { ExtendedHTMLElement } from "../types";
import evaluateExpression from "../evaluate-expression";
import setState from "../set-state";

// In the current implementation the handler triggers only once.
// Likely supporting options would be a good idea.
function evaluateIntersect(
  intersectContainers: NodeListOf<ExtendedHTMLElement>,
  intersectKey: string,
  stateKey: string
) {
  for (let i = intersectContainers.length; i--; ) {
    const intersectContainer = intersectContainers[i] as ExtendedHTMLElement;
    const intersectExpression =
      intersectContainer.getAttribute(intersectKey) || "";
    const intersectParameters = evaluateExpression(intersectExpression, {});
    const intersectState = intersectParameters.state;
    const intersectOptions = intersectParameters.options || {};
    const key = Object.keys(intersectState)[0];
    const state = evaluateExpression(
      intersectContainer.getAttribute(stateKey) || ""
    );
    const emptyIntersect = { [key]: "" };

    intersectContainer.setAttribute(
      stateKey,
      JSON.stringify(state ? { ...state, ...emptyIntersect } : emptyIntersect)
    );

    let triggered = false;
    const observer = new IntersectionObserver(
      entries => {
        if (intersectOptions.once && triggered) {
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

        setState(
          evaluateExpression(intersectExpression).state,
          intersectContainer
        );
      },
      {
        rootMargin: "0px",
        threshold: 1.0,
        ...intersectOptions,
      }
    );
    observer.observe(intersectContainer);
  }
}

export default evaluateIntersect;
