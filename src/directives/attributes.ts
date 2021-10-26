import { DirectiveParameters, ExtendedHTMLElement } from "../types";

const ATTRIBUTE_KEY = "x-";

function attributesDirective({
  element,
  evaluate,
  getState,
}: DirectiveParameters) {
  const attributes = Array.from(element.attributes);

  attributes.forEach((attribute) => {
    const attributeName = attribute.nodeName;

    if (attributeName.startsWith(ATTRIBUTE_KEY)) {
      if (isForbidden(attributeName)) {
        return;
      }

      setAttribute(
        element,
        attributeName.slice(2),
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
    const initialClass = element.getAttribute("x-initial-class");

    if (initialClass) {
      extraValues = initialClass.split(" ");
    }
  }

  const initialValues = Array.isArray(evaluatedValue)
    ? evaluatedValue.filter(Boolean)
    : [evaluatedValue];

  element.setAttribute(targetName, initialValues.concat(extraValues).join(" "));
}

attributesDirective.init = function generateAttributeKeys(
  parent: ExtendedHTMLElement
) {
  // TODO: Likely it's smartest to go only through x-state scopes (drop check from setXInitialClass)
  // for a bit of extra performance at init.
  Array.from(parent.querySelectorAll("*"))
    .concat(parent)
    .forEach((element) => {
      setXInitialClass(element);
      setXAttr(element);
    });
};

function setXAttr(element: Element) {
  Array.from(element.attributes || []).some(
    (attribute) =>
      attribute.name.startsWith(ATTRIBUTE_KEY) && !isForbidden(attribute.name)
  ) && element.setAttribute("x-attr", "");
}

// TODO: This could be potentially generalized if there's use for the feature beyond
// classes.
function setXInitialClass(element: Element) {
  const classAttribute = element.getAttribute("class");
  const xClassAttribute = element.getAttribute("x-class");
  const xEvaluatableAttribute = element.getAttribute("x-evaluatable");
  const xInitialClassAttribute = element.getAttribute("x-initial-class");

  if (
    classAttribute &&
    xClassAttribute &&
    !xInitialClassAttribute &&
    !xEvaluatableAttribute
  ) {
    element.setAttribute("x-initial-class", classAttribute);
  } else if (element.closest(`[x-state]`)) {
    element.setAttribute("x-evaluatable", "true");
  }
}

function isForbidden(name: string) {
  return [
    "x",
    "x-attr",
    "x-each",
    "x-evaluatable",
    "x-initial-class",
    "x-label",
    "x-recurse",
    "x-state",
    "x-updated",
  ].includes(name);
}

export default attributesDirective;
