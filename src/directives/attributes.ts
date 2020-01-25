import { BindState, DirectiveParameters, ExtendedHTMLElement } from "../types";
import evaluateExpression from "../evaluate-expression";
import { getLabeledState } from "../utils";

function attributesDirective({ element }: DirectiveParameters) {
  const attributes = Array.from(element.attributes);
  const closestStateContainer = element.closest(
    `[x-state]`
  ) as ExtendedHTMLElement;
  const { state }: { state: BindState } = closestStateContainer;
  const valueKey = "x:";

  attributes.forEach(attribute => {
    const attributeName = attribute.nodeName;

    if (attributeName.startsWith(valueKey)) {
      const attributeProperty = attribute.value;
      const targetName = attributeName.split(valueKey).filter(Boolean)[0];
      const labeledState = getLabeledState(element, "x-label");

      if (state === null) {
        return;
      }

      const evaluatedValue = evaluateExpression(attributeProperty, {
        ...labeledState,
        state,
      });

      if (attributeName === valueKey) {
        if (element.localName === "input") {
          element.value = evaluatedValue;
        } else {
          element.innerHTML = evaluatedValue;
        }
      } else {
        element.setAttribute(
          targetName,
          Array.isArray(evaluatedValue)
            ? evaluatedValue.filter(Boolean).join(" ")
            : evaluatedValue
        );
      }
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
