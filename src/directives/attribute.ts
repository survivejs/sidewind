import { DirectiveParameters, ExtendedHTMLElement } from "../types";

const X_INITIAL_CLASS = "x-initial-class";

function attributeDirective({
  element,
  evaluate,
  getState,
}: DirectiveParameters) {
  const attributes = Array.from(element.attributes);

  attributes.forEach((attribute) => {
    const attributeName = attribute.nodeName;

    if (attributeName.startsWith("@")) {
      setAttribute(
        element,
        attributeName.slice(1),
        evaluate(attribute.value, getState(element))
      );
    }
  });
}

function setAttribute(
  element: ExtendedHTMLElement,
  targetName: string,
  evaluatedValue: any
) {
  let extraValues: string[] = [];

  if (targetName === "class") {
    const initialClass = element.getAttribute(X_INITIAL_CLASS);

    if (typeof initialClass === "string") {
      extraValues = initialClass.split(" ");
    } else {
      const classValue = element.getAttribute("class") || "";

      element.setAttribute(X_INITIAL_CLASS, classValue);
      extraValues = classValue.split(" ");
    }
  }

  const initialValues = Array.isArray(evaluatedValue)
    ? evaluatedValue.filter(Boolean)
    : [evaluatedValue];

  element.setAttribute(targetName, initialValues.concat(extraValues).join(" "));
}

export default attributeDirective;
