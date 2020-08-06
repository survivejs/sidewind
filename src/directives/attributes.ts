import { DirectiveParameters, ExtendedHTMLElement } from "../types";

const ATTRIBUTE_KEY = "x-";

function attributesDirective({
  element,
  evaluate,
  getState,
}: DirectiveParameters) {
  const attributes = Array.from(element.attributes);

  attributes.forEach(attribute => {
    const attributeName = attribute.nodeName;

    if (attributeName.startsWith(ATTRIBUTE_KEY)) {
      const targetName = attributeName.split(ATTRIBUTE_KEY).filter(Boolean)[0];

      if (isForbidden(targetName)) {
        return;
      }

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
attributesDirective.init = function generateAttributeKeys(
  parent: ExtendedHTMLElement
) {
  Array.from(parent.querySelectorAll("*"))
    .concat(parent)
    .forEach(
      element =>
        Array.from(element.attributes || []).some(
          attribute =>
            attribute.name.startsWith(ATTRIBUTE_KEY) &&
            !isForbidden(attribute.name)
        ) && element.setAttribute("x-attr", "")
    );
};

function isForbidden(name: string) {
  return ["x", "x-attr", "x-each", "x-label", "x-state"].includes(name);
}

export default attributesDirective;
