import { ExtendedHTMLElement } from "../types";
import { evaluateExpression } from "../evaluators";
import { getValues } from "../utils";

function evaluateClosest(
  closestContainers: NodeListOf<ExtendedHTMLElement>,
  closestKey: string
) {
  for (let i = closestContainers.length; i--; ) {
    const closestContainer = closestContainers[i] as ExtendedHTMLElement;
    const closestExpression = closestContainer.getAttribute(closestKey) || "";
    const state = evaluateExpression(closestExpression, {});
    const key = Object.keys(state)[0];

    document.onscroll = () => {
      const elements = Array.from(getValues(state, key)[key]).map(value => {
        const element = value as HTMLElement;
        const { top } = element.getBoundingClientRect();

        return {
          element,
          top,
        };
      });
      const closestElement = elements.reduce((a, b) =>
        Math.abs(a.top) < Math.abs(b.top) ? a : b
      );

      // TODO: Set to x-state
      console.log(closestElement);
    };
  }
}

export default evaluateClosest;
