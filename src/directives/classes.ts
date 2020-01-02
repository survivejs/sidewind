import { State, ExtendedHTMLElement } from "../types";

function evaluateClasses(stateContainer: ExtendedHTMLElement, state: State) {
  const elements = stateContainer.querySelectorAll(":scope *");

  for (let i = elements.length; i--; ) {
    const element = elements[i];
    const xAttributes = Array.from(element.attributes).filter(v =>
      v.name.startsWith("x-")
    );

    if (xAttributes.length > 0) {
      xAttributes.forEach(({ name, value }) => {
        const caseAttribute = element.getAttribute("x-case");

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
