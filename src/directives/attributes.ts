import { BindState, ExtendedHTMLElement } from "../types";
import evaluateExpression from "../evaluate-expression";
import { get } from "../utils";

function evaluateAttributes(
  stateContainer: HTMLElement,
  attributeKey: string,
  stateKey: string
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
    const { state }: { state: BindState } = attributeContainer.closest(
      `[${stateKey}]`
    ) as ExtendedHTMLElement;

    attributes.forEach(attribute => {
      const prefix = "x:";
      const attributeName = attribute.nodeName;

      if (attributeName.startsWith(prefix)) {
        const attributeProperty = attribute.value;
        const targetName = attributeName.split(prefix).filter(Boolean)[0];

        let evaluatedValue;

        // TODO: Figure out why this can happen
        if (!state) {
          return;
        }

        // DOM node case
        if (state.nodeType) {
          evaluatedValue = get(state, attributeProperty);
        } else {
          evaluatedValue = state.hasOwnProperty(attributeProperty)
            ? state[attributeProperty]
            : evaluateExpression(attributeProperty, { state }) || state;
        }

        attributeContainer.setAttribute(targetName, evaluatedValue);
      }
    });
  }
}

export default evaluateAttributes;
