import { DirectiveParameters, ExtendedHTMLElement } from "../types";

function attributesDirective({
  element,
  evaluate,
  getState,
}: DirectiveParameters) {
  const attributes = Array.from(element.attributes);
  const attributeKey = "x:";

  attributes.forEach(attribute => {
    const attributeName = attribute.nodeName;

    if (attributeName.startsWith(attributeKey)) {
      const targetName = attributeName.split(attributeKey).filter(Boolean)[0];

      const evaluatedValue = evaluate(attribute.value, getState(element));

      element.setAttribute(
        targetName,
        Array.isArray(evaluatedValue)
          ? evaluatedValue.filter(Boolean).join(" ")
          : evaluatedValue
      );
    }
  });
}
attributesDirective.skipEvaluation = true;
attributesDirective.init = function generateAttributeKeys(
  parent: ExtendedHTMLElement
) {
  Array.from(parent.querySelectorAll("*"))
    .concat(parent)
    .forEach(
      element =>
        Array.from(element.attributes || []).some(attribute =>
          attribute.name.startsWith("x:")
        ) && element.setAttribute("x-attr", "")
    );
};

export default attributesDirective;
