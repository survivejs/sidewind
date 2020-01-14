import { BindState, ExtendedHTMLElement } from "../types";
import evaluateExpression from "../evaluate-expression";

function evaluateClasses(
  stateContainer: ExtendedHTMLElement,
  stateKey: string,
  labelKey: string
) {
  const elements = stateContainer.querySelectorAll(":scope *");

  for (let i = elements.length; i--; ) {
    const element = elements[i] as ExtendedHTMLElement;

    Array.from(element.attributes).forEach(({ name, value }) => {
      if (name === "x-on") {
        return toggleClass(
          evaluateCase(element, stateKey, labelKey),
          element,
          value
        );
      }

      if (name === "x-off") {
        return toggleClass(
          !evaluateCase(element, stateKey, labelKey),
          element,
          value
        );
      }
    });
  }
}

function evaluateCase(
  element: ExtendedHTMLElement,
  stateKey: string,
  labelKey: string
) {
  const caseAttribute = element.getAttribute("x-case");
  const { state }: { state: BindState } = element.closest(
    `[${stateKey}]`
  ) as ExtendedHTMLElement;

  if (caseAttribute) {
    if (typeof state === "object") {
      const labeledState = getLabeledState(labelKey);

      const combinedState = { ...labeledState, state };

      return evaluateExpression(caseAttribute, combinedState);
    } else {
      return caseAttribute === state;
    }
  } else {
    return typeof state === "boolean" && state;
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
