import { State, ExtendedHTMLElement } from "../types";
import { evaluateExpression } from "../evaluators";

function evaluateClasses(stateContainer: ExtendedHTMLElement, state: State) {
  const elements = stateContainer.querySelectorAll(":scope *");

  for (let i = elements.length; i--; ) {
    const element = elements[i];
    const dataAttributes = Array.from(element.attributes).filter(
      v =>
        v.name.startsWith("data-") &&
        ![
          "data-bind",
          "data-each",
          "data-fetch",
          "data-state",
          "data-value",
        ].includes(v.name)
    );

    if (dataAttributes.length > 0) {
      dataAttributes.forEach(({ name, value }) => {
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
