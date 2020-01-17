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
    const intervalParameters = evaluateExpression(intervalExpression);
    const state = evaluateExpression(
      intervalContainer.getAttribute(stateKey) || ""
    );
    const intervalState = intervalParameters.state;
    const intervalOptions = intervalParameters.options || { delay: 1000 };

    intervalContainer.setAttribute(
      stateKey,
      JSON.stringify(state ? { ...state, ...intervalState } : intervalState)
    );

    setInterval(() => {
      setState(evaluateExpression(intervalExpression).state, intervalContainer);
    }, intervalOptions.delay);
  }
}

export default evaluateInterval;
