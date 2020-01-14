import { BindState, State, ExtendedHTMLElement } from "../types";
import evaluateExpression from "../evaluate-expression";

function evaluateClasses(
  stateContainer: ExtendedHTMLElement,
  state: State,
  stateKey: string,
  labelKey: string
) {
  const elements = stateContainer.querySelectorAll(":scope *");

  for (let i = elements.length; i--; ) {
    const element = elements[i] as ExtendedHTMLElement;
    const xAttributes = Array.from(element.attributes).filter(v =>
      v.name.startsWith("x-")
    );

    if (xAttributes.length > 0) {
      xAttributes.forEach(({ name, value }) => {
        const caseAttribute = element.getAttribute("x-case");

        if (caseAttribute) {
          const { state }: { state: BindState } = element.closest(
            `[${stateKey}]`
          ) as ExtendedHTMLElement;

          if (typeof state === "object") {
            const labeledState = getLabeledState(labelKey);

            const combinedState = { ...labeledState, state };

            const expressionResult = evaluateExpression(
              caseAttribute,
              combinedState
            );

            state && console.log(expressionResult);
          }
        }

        if (name === "x-on") {
          return toggleClass(
            caseAttribute
              ? caseAttribute === state
              : typeof state === "boolean" && state,
            element,
            value
          );
        }

        if (name === "x-off") {
          return toggleClass(
            caseAttribute
              ? caseAttribute !== state
              : typeof state === "boolean" && !state,
            element,
            value
          );
        }
      });
    }
  }
}

function getLabeledState(labelKey: string) {
  const labeledStateContainers = document.querySelectorAll(`[${labelKey}]`);
  const ret: BindState = {};

  for (let i = labeledStateContainers.length; i--; ) {
    const labeledStateContainer = labeledStateContainers[
      i
    ] as ExtendedHTMLElement;
    const label = labeledStateContainer.getAttribute(labelKey);

    if (label) {
      ret[label] = labeledStateContainer.state;
    }
  }

  return ret;
}

function toggleClass(
  condition: boolean,
  element: Element,
  cssPropName: string
) {
  if (condition) {
    element.classList.add(cssPropName);
  } else {
    element.classList.remove(cssPropName);
  }
}

export default evaluateClasses;
