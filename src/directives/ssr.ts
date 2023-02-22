import { getLevel, getTemplates, isObject } from "../utils.ts";
import type { DirectiveParameters, ExtendedHTMLElement } from "../../types.ts";

function ssrDirective({ element }: DirectiveParameters) {
  // @ts-ignore TODO: Fix the type
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

        if (k) {
          const kParts = k.split(".");
          const v = extractValuesFromTemplates(
            xEachContainer,
            getTemplates(xEachContainer),
            level + 1
          );

          // TODO: Can unpacking be avoided for arrays?
          // @ts-ignore How to type this?
          const value = Array.isArray(v) ? v.map((i) => i[0]) : v;

          // @ts-ignore How to type this?
          set(newState, kParts, value);

          // The actual state is stored to the object
          xTemplate.state = { value, level };
        }
      }
    }

    ret.push(newState);
  }

  return ret;
}

function set(o: Record<string, unknown>, keys: string[], value: unknown) {
  let previousO = o;

  keys.forEach((k, i) => {
    // Set the value to the last part
    if (i === keys.length - 1) {
      previousO[k] = value;
    } else {
      // Construct objects if they don't exist yet
      if (!isObject(o[k])) {
        o[k] = {};
      }

      // @ts-ignore Figure out how to type this
      previousO = o[k];
    }
  });
}

function getValues(element: HTMLElement, xTemplate: HTMLElement) {
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
