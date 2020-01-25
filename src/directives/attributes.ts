import { BindState, DirectiveParameters, ExtendedHTMLElement } from "../types";
import evaluateExpression from "../evaluate-expression";
import { getLabeledState } from "../utils";

function attributesDirective({ element }: DirectiveParameters) {
  const attributes = Array.from(element.attributes);
  const closestStateContainer = element.closest(
    `[x-state]`
  ) as ExtendedHTMLElement;
  const { state }: { state: BindState } = closestStateContainer;
  const attributeKey = "x:";

  attributes.forEach(attribute => {
    const attributeName = attribute.nodeName;

    if (attributeName.startsWith(attributeKey)) {
      const targetName = attributeName.split(attributeKey).filter(Boolean)[0];
      const labeledState = getLabeledState(element, "x-label");

      if (state === null) {
        return;
      }

      const evaluatedValue = evaluateExpression(attribute.value, {
        ...labeledState,
        state,
      });

      element.setAttribute(
        targetName,
        Array.isArray(evaluatedValue)
          ? evaluatedValue.filter(Boolean).join(" ")
          : evaluatedValue
      );
    }
  });
}

// TODO
attributesDirective.init = generateAttributeKeys;

function generateAttributeKeys(stateContainers: ExtendedHTMLElement[]) {
  stateContainers.forEach(stateContainer =>
    Array.from(stateContainer.querySelectorAll("*"))
      .concat(stateContainer)
      .forEach(element => {
        const attributes = Array.from(element.attributes);

        attributes.some(attribute => attribute.name.startsWith("x:")) &&
          element.setAttribute("x-attr", "");
      })
  );
}

export default attributesDirective;
