import { BindState, ExtendedHTMLElement } from "../types";
import evaluateExpression from "../evaluate-expression";
import { get, getLabeledState } from "../utils";

function evaluateAttributes(
  stateContainer: HTMLElement,
  attributeKey: string,
  stateKey: string,
  labelKey: string
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
          const labeledState = getLabeledState(attributeContainer, labelKey);

          evaluatedValue = state.hasOwnProperty(attributeProperty)
            ? state[attributeProperty]
            : evaluateExpression(attributeProperty, {
                ...labeledState,
                state,
              }) || state;
        }

        attributeContainer.setAttribute(
          targetName,
          Array.isArray(evaluatedValue)
            ? evaluatedValue.filter(Boolean).join(" ")
            : evaluatedValue
        );
      }
    });
  }
}

export default evaluateAttributes;
