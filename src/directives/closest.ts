import { ExtendedHTMLElement } from "../types";
import { evaluateExpression } from "../evaluators";
import { getValues } from "../utils";
import setState from "../set-state";

function evaluateClosest(
  closestContainers: NodeListOf<ExtendedHTMLElement>,
  closestKey: string,
  stateKey: string
) {
  for (let i = closestContainers.length; i--; ) {
    const closestContainer = closestContainers[i] as ExtendedHTMLElement;
    const closestExpression = closestContainer.getAttribute(closestKey) || "";
    const closestState = evaluateExpression(closestExpression, {});
    const key = Object.keys(closestState)[0];
    const state = evaluateExpression(
      closestContainer.getAttribute(stateKey) || "",
      {}
    );
    const emptyClosest = { [key]: "" };

    closestContainer.setAttribute(
      stateKey,
      JSON.stringify(state ? { ...state, ...emptyClosest } : emptyClosest)
    );

    document.onscroll = () => {
      const elements = Array.from(getValues(closestState, key)[key]).map(
        value => {
          const element = value as HTMLElement;
          const { top } = element.getBoundingClientRect();

          return {
            element,
            top,
          };
        }
      );
      const closest = elements.reduce((a, b) =>
        Math.abs(a.top) < Math.abs(b.top) ? a : b
      );

      setState({ [key]: closest.element }, closestContainer);
    };
  }
}

export default evaluateClosest;
