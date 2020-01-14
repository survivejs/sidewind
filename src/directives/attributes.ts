import { BindState, ExtendedHTMLElement } from "../types";
import { evaluateExpression } from "../evaluators";
import { get } from "../utils";

function evaluateAttributes(
  stateContainer: HTMLElement,
  attributeKey: string,
  stateKey: string
) {
  const attributeContainers = stateContainer.querySelectorAll(
    `:scope [${attributeKey}]`
  );

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

        // DOM node case
        if (state.nodeType) {
          evaluatedValue = get(state, attributeProperty);
        } else {
          evaluatedValue = state.hasOwnProperty(attributeProperty)
            ? state[attributeProperty]
            : evaluateExpression(attributeProperty, state) || state;
        }

        attributeContainer.setAttribute(targetName, evaluatedValue);
      }
    });
  }
}

export default evaluateAttributes;