import { ExtendedHTMLElement } from "../types";
import evaluateExpression from "../evaluate-expression";
import setState from "../set-state";

function evaluateInterval(
  intervalContainers: NodeListOf<ExtendedHTMLElement>,
  intervalKey: string,
  stateKey: string
) {
  for (let i = intervalContainers.length; i--; ) {
    const intervalContainer = intervalContainers[i] as ExtendedHTMLElement;
    const intervalExpression =
      intervalContainer.getAttribute(intervalKey) || "";
    const intervalState = evaluateExpression(intervalExpression);
    const state = evaluateExpression(
      intervalContainer.getAttribute(stateKey) || ""
    );

    intervalContainer.setAttribute(
      stateKey,
      JSON.stringify(state ? { ...state, ...intervalState } : intervalState)
    );

    // TODO: Expose delay parameter somehow (needs a convention)
    setInterval(() => {
      setState(evaluateExpression(intervalExpression), intervalContainer);
    }, 1000);
  }
}

export default evaluateInterval;
