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
    const state = evaluateExpression(closestExpression, {});
    const key = Object.keys(state)[0];

    closestContainer.setAttribute(stateKey, `{ ${key}: ''}`);

    document.onscroll = () => {
      const elements = Array.from(getValues(state, key)[key]).map(value => {
        const element = value as HTMLElement;
        const { top } = element.getBoundingClientRect();

        return {
          element,
          top,
        };
      });
      const closest = elements.reduce((a, b) =>
        Math.abs(a.top) < Math.abs(b.top) ? a : b
      );

      // TODO: Allow bind to parse textContent properly so element
      // can be passed
      setState({ [key]: closest.element.textContent }, closestContainer);
    };
  }
}

export default evaluateClosest;
