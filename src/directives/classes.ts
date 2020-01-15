/* eslint no-new-func: 0 */
import { BindState, ExtendedHTMLElement } from "../types";
import { getLabeledState } from "../utils";

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

      return evaluateCaseExpression(caseAttribute, { ...labeledState, state });
    } else {
      return caseAttribute === state;
    }
  } else {
    return typeof state === "boolean" && state;
  }
}

// TODO: See if this can be combined with the general one
function evaluateCaseExpression(expression: string, value: BindState) {
  try {
    return Function(
      ...Object.keys(value),
      `return ${expression}`
    )(...Object.values(value));
  } catch (err) {
    console.error("Failed to evaluate", expression, value, err);
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
