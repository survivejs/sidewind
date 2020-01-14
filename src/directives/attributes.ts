import { BindState, ExtendedHTMLElement } from "../types";
import { evaluateExpression } from "../evaluators";

function evaluateAttributes(
  stateContainer: HTMLElement,
  state: BindState,
  attributeKey: string
) {
  const attributeContainers = stateContainer.querySelectorAll(
    `:scope [${attributeKey}]`
  );

  // TODO: If inside x-each, handle differently!
  // TODO: Same for x-bind. That should become x-value
  for (let i = attributeContainers.length; i--; ) {
    const attributeContainer = attributeContainers[i] as ExtendedHTMLElement;
    const attributes = Array.from(attributeContainer.attributes);

    attributes.forEach(attribute => {
      const prefix = "x:";
      const attributeName = attribute.nodeName;

      if (attributeName.startsWith(prefix)) {
        const value = attribute.value;
        const targetName = attributeName.split(prefix).filter(Boolean)[0];

        attributeContainer.setAttribute(
          targetName,
          evaluateExpression(value, state)
        );
      }
    });
  }

  // 2. Evaluate value based on stateContainer.state
}

export default evaluateAttributes;
