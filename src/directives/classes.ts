import { State, ExtendedHTMLElement } from "../types";
import { evaluateExpression } from "../evaluators";

function evaluateClasses(stateContainer: ExtendedHTMLElement, state: State) {
  const elements = stateContainer.querySelectorAll(":scope *");

  for (let i = elements.length; i--; ) {
    const element = elements[i];
    const xAttributes = Array.from(element.attributes).filter(
      v =>
        v.name.startsWith("x-") &&
        // TODO: Figure out a better way
        ![
          "x-bind",
          "x-case",
          "x-each",
          "x-fetch",
          "x-state",
          "x-value",
        ].includes(v.name)
    );

    if (xAttributes.length > 0) {
      xAttributes.forEach(({ name, value }) => {
        if (name === "x-on") {
          return toggleClass(
            element.getAttribute("x-case") === state,
            element,
            value
          );
        }

        if (name === "x-not") {
          return toggleClass(
            element.getAttribute("x-case") !== state,
            element,
            value
          );
        }

        const result = evaluateExpression(value, state);

        if (typeof result === "undefined") {
          return;
        }

        const cssPropName = name
          .split("-")
          .slice(1)
          .join("-");

        toggleClass(result, element, cssPropName);
      });
    }
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
