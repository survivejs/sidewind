import { BindState, State, ExtendedHTMLElement } from "../types";
// import evaluateExpression from "../evaluate-expression";

function evaluateClasses(
  stateContainer: ExtendedHTMLElement,
  state: State,
  stateKey: string
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
          // TODO: Combine labeled parent state to this state too!
          const { state }: { state: BindState } = element.closest(
            `[${stateKey}]`
          ) as ExtendedHTMLElement;

          state &&
            console.log(
              state,
              element,
              caseAttribute
              // evaluateExpression(caseAttribute, state)
            );
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
