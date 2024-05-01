import { asyncEvaluate } from "../async-evaluate";
import { DirectiveParameters, ExtendedHTMLElement } from "../types";

const X_INITIAL_CLASS = "x-initial-class";

function attributeDirective({ element, getState }: DirectiveParameters) {
  const attributes = Array.from(element.attributes);

  return Promise.all(
    attributes.map(async (attribute) => {
      // @ts-ignore TODO: Fix the type
      const attributeName = attribute.nodeName;

      if (attributeName.startsWith("@")) {
        const state = await asyncEvaluate(
          // @ts-ignore TODO: Fix the type
          attribute.value,
          getState(element),
          element
        );

        setAttribute(element, attributeName.slice(1), state);
      }
    })
  );
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
