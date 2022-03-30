import { getLevel, getTemplates } from "../utils";
import type { DirectiveParameters, ExtendedHTMLElement } from "../types";

function ssrDirective({ element }: DirectiveParameters) {
  element.state = extractValuesFromTemplates(
    element,
    getTemplates(element),
    getLevel(element)
  );

  // Find the closest state container and update its internal state
  const parentStateElement: ExtendedHTMLElement | null =
    element.closest("[x-state]");

  if (parentStateElement) {
    const expression = element.getAttribute("x-each");

    if (!expression) {
      console.error("x-ssr - adjacent x-each was not found");

      return;
    }

    const parentKey = expression.split("state.")[1];

    parentStateElement.state = {
      ...parentStateElement.state,
      [parentKey]: element.state,
    };
  }

  // Now that the state has been captured, go back to normal flow
  element.removeAttribute("x-ssr");
}
ssrDirective.evaluateFrom = "top";

function extractValuesFromTemplates(
  element: ExtendedHTMLElement,
  xTemplates: ExtendedHTMLElement["templates"],
  level: number
) {
  const ret = [];

  if (!xTemplates) {
    return [];
  }

  for (let i = 0; i < xTemplates.length; i++) {
    const xTemplate = xTemplates[i] as ExtendedHTMLElement;
    const newState = getValues(element, xTemplate);
    const xEachContainers = xTemplate.querySelectorAll("[x-each]");

    // The element should be a state container itself so that children can
    // access its data.
    xTemplate.setAttribute("x-state", "");

    for (let j = 0; j < xEachContainers.length; j++) {
      const xEachContainer = xEachContainers[j] as ExtendedHTMLElement;

      // Pick only elements that have the x-each as their parent.
      // The gotcha here is that since the element itself is x-each,
      // closest() matches to itself so you should traverse starting from
      // the immediate parent.
      if (xEachContainer.parentElement?.closest("[x-each]") === element) {
        const xEachValue = xEachContainer.getAttribute("x-each") || "";
        const k = xEachValue.split("state.value.")[1];

        const v = extractValuesFromTemplates(
          xEachContainer,
          getTemplates(xEachContainer),
          level + 1
        );

        if (k) {
          // TODO: Can unpacking be avoided for arrays?
          if (Array.isArray(v)) {
            // @ts-ignore How to type this?
            newState[k] = v.map((i) => i[0]);
          } else {
            // @ts-ignore How to type this?
            newState[k] = v;
          }

          // The actual state is stored to the object
          xTemplate.state = { value: v, level };
        }
      }
    }

    ret.push(newState);
  }

  return ret;
}

function getValues(
  element: ExtendedHTMLElement,
  xTemplate: ExtendedHTMLElement
) {
  const xValues = xTemplate.hasAttribute("x")
    ? [xTemplate]
    : xTemplate.querySelectorAll("[x]");
  const newObjectState: Record<string, unknown> = {};
  const newArrayState = [];

  for (let j = 0; j < xValues.length; j++) {
    const xValue = xValues[j];

    // Pick only elements that have the x-each as their parent
    if (xValue.closest("[x-each]") === element) {
      const xProperty = xValue.getAttribute("x") || "";
      const v = xValue.textContent;

      if (xProperty === "state.value") {
        newArrayState.push(v);
      } else {
        const k = xProperty.split("state.value.")[1];

        if (k) {
          newObjectState[k] = v;
        }
      }
    }
  }

  return newArrayState.length > 0 ? newArrayState : newObjectState;
}

export default ssrDirective;
