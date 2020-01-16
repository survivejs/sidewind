/* eslint no-new-func: 0 */
import { BindState, ExtendedHTMLElement } from "../types";
import { getLabeledState } from "../utils";
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
      const labeledState = getLabeledState(element, labelKey);

      return evaluateExpression(caseAttribute, { ...labeledState, state });
    } else {
      return caseAttribute === state;
    }
  } else {
    return typeof state === "boolean" && state;
  }
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
