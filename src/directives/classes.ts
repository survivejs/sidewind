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
          if (element.getAttribute("x-case") === state) {
            element.classList.add(value);
          } else {
            element.classList.remove(value);
          }

          return;
        }

        if (name === "x-not") {
          if (element.getAttribute("x-case") !== state) {
            element.classList.add(value);
          } else {
            element.classList.remove(value);
          }

          return;
        }

        const result = evaluateExpression(value, state);

        if (typeof result === "undefined") {
          return;
        }

        const cssPropName = name
          .split("-")
          .slice(1)
          .join("-");

        if (result) {
          element.classList.add(cssPropName);
        } else {
          element.classList.remove(cssPropName);
        }
      });
    }
  }
}

export default evaluateClasses;
