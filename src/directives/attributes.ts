import { BindState, ExtendedHTMLElement } from "../types";
import evaluateExpression from "../evaluate-expression";
import { getLabeledState } from "../utils";

function evaluateAttributes(
  stateContainer: HTMLElement,
  attributeKey: string,
  stateKey: string,
  labelKey: string,
  valueKey: string
) {
  const attributeContainers = Array.from(
    stateContainer.querySelectorAll(`:scope [${attributeKey}]`)
  );

  // A state container can be an attribute container itself
  if (stateContainer.hasAttribute(attributeKey)) {
    attributeContainers.push(stateContainer);
  }

  for (let i = attributeContainers.length; i--; ) {
    const attributeContainer = attributeContainers[i] as ExtendedHTMLElement;
    const attributes = Array.from(attributeContainer.attributes);
    const closestStateContainer = attributeContainer.closest(
      `[${stateKey}]`
    ) as ExtendedHTMLElement;

    if (stateContainer !== closestStateContainer) {
      continue;
    }

    const { state }: { state: BindState } = closestStateContainer;

    attributes.forEach(attribute => {
      const attributeName = attribute.nodeName;

      if (attributeName.startsWith(valueKey)) {
        const attributeProperty = attribute.value;
        const targetName = attributeName.split(valueKey).filter(Boolean)[0];
        const labeledState = getLabeledState(attributeContainer, labelKey);
        const evaluatedValue = state.hasOwnProperty(attributeProperty)
          ? state[attributeProperty]
          : evaluateExpression(attributeProperty, {
              ...labeledState,
              state,
            }) || state;

        if (attributeName === valueKey) {
          if (attributeContainer.localName === "input") {
            attributeContainer.value = evaluatedValue;
          } else {
            attributeContainer.innerHTML =
              typeof evaluatedValue === "object"
                ? JSON.stringify(evaluatedValue, null, 2)
                : evaluatedValue;
          }
        } else {
          attributeContainer.setAttribute(
            targetName,
            Array.isArray(evaluatedValue)
              ? evaluatedValue.filter(Boolean).join(" ")
              : evaluatedValue
          );
        }
      }
    });
  }
}

export default evaluateAttributes;
