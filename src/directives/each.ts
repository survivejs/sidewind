import getParents from "../get-parents";
import type { DirectiveParameters, ExtendedHTMLElement } from "../types";

function eachDirective({
  element,
  expression,
  evaluate,
  getState,
  evaluateDirectives,
  directives,
}: DirectiveParameters) {
  const elementState = getState(element);
  const state = evaluate(expression, elementState) || [];

  if (!Array.isArray(state)) {
    console.error(
      "x-each - Evaluated expression does not yield an array",
      expression,
      element
    );

    return;
  }

  if (state === element.state) {
    return;
  }

  const level =
    getParents(element, "x-recurse").length +
    (element.hasAttribute("x-recurse") ? 1 : 0);
  const amountOfTemplates = element.templates?.length || 0;

  if (amountOfTemplates > 0) {
    const amountOfItems = state.length * amountOfTemplates;
    const amountOfChildren = element.children.length;
    const amountOfExtraNodes = amountOfItems - amountOfChildren;

    // Remove extra nodes
    if (amountOfExtraNodes < 0) {
      for (let i = 0; i < -amountOfExtraNodes; i++) {
        element.lastElementChild?.remove();
      }
    }

    let child = element.firstElementChild as ExtendedHTMLElement;

    state.forEach((value: any) => {
      for (let i = 0; i < amountOfTemplates; i++) {
        if (child) {
          child.setAttribute("x-state", "");
          // The actual state is stored to the object
          child.state = { value, level };

          child = child.nextElementSibling as ExtendedHTMLElement;
        }
      }
    });

    if (child && state.length === 0) {
      child.remove();
    }

    // Create missing nodes
    if (amountOfExtraNodes > 0) {
      for (let i = 0; i < amountOfExtraNodes / amountOfTemplates; i++) {
        const renderTemplate = getTemplateRenderer(
          element,
          element.templates,
          level
        );

        state
          .slice(amountOfChildren / amountOfTemplates)
          .forEach(renderTemplate);
      }
    }
  } else {
    const hasParentEach = !!element.closest("[x-has-each]");

    // Stash state so it can be compared later to avoid work.
    // In case state is derived from another x-each, use getState(element) here.
    element.state = hasParentEach ? elementState.state : state;

    const xTemplates = element.querySelectorAll(":scope > *[x-template]");
    let templates = xTemplates;

    if (!templates.length) {
      console.error("x-each - x-template was not found", element);

      return;
    }

    // If x-template isn't meant to be a group, pick only the first one
    if (templates[0].getAttribute("x-template") !== "group") {
      // @ts-ignore Figure out the right way to type this (should be a NodeList)
      templates = [templates[0]];
    }

    // Stash template for future use
    element.templates = templates;

    // Mark element as initialized (needed by state evaluation)
    element.setAttribute("_x-init", "1");
    element.setAttribute("x-has-each", "");

    if (element.hasAttribute("x-ssr")) {
      // TODO: Capture state now
      // 1. Go through each template
      // 2. Pick x (but not inside x-each) and x-each (set x-ssr for these?)
      // When picking x, skip state.value prefix and pick remaining field name
      // Value should be element textContent

      for (let i = 0; i < xTemplates.length; i++) {
        const xTemplate = xTemplates[i];
        const newState = getValues(element, xTemplate);
        const xEachContainers = xTemplate.querySelectorAll("[x-each]");

        for (let j = 0; j < xEachContainers.length; j++) {
          const xEachContainer = xEachContainers[j];

          // Pick only elements that have the x-each as their parent.
          // The gotcha here is that since the element itself is x-each,
          // closest() matches to itself so you should traverse starting from
          // the immediate parent.
          if (xEachContainer.parentElement.closest("[x-each]") === element) {
            const k = xEachContainer
              .getAttribute("x-each")
              .split("state.value.")[1];

            // TODO: Get values
            console.log("found valid x-each", k);

            if (k) {
              newState[k] = [];
            }
          }
        }

        console.log("x-each containers", xEachContainers);

        element.state.push(newState);
      }

      // Find the closest state container and update its internal state
      const parentStateElement = element.closest("[x-state]");
      const parentKey = expression.split("state.")[1];
      parentStateElement.state = {
        ...parentStateElement.state,
        [parentKey]: element.state,
      };
    } else {
      // Empty contents as they'll be replaced by applying the template
      while (element.firstChild) {
        element.lastChild && element.removeChild(element.lastChild);
      }

      const renderTemplate = getTemplateRenderer(element, templates, level);

      state.forEach(renderTemplate);
    }
  }

  evaluateDirectives(directives, element);
}
eachDirective.evaluateFrom = "top";

function getValues(
  element: ExtendedHTMLElement,
  xTemplate: ExtendedHTMLElement
) {
  const xValues = xTemplate.querySelectorAll("[x]");
  const newState: Record<string, unknown> = {};

  for (let j = 0; j < xValues.length; j++) {
    const xValue = xValues[j];

    // Pick only elements that have the x-each as their parent
    if (xValue.closest("[x-each]") === element) {
      const k = xValue.getAttribute("x").split("state.value.")[1];
      const v = xValue.textContent;

      if (k) {
        newState[k] = v;
      }
    }
  }

  return newState;
}

function getTemplateRenderer(
  element: ExtendedHTMLElement,
  templates: ExtendedHTMLElement["templates"],
  level: number
) {
  const renderTemplate = (value: any) => {
    if (!templates) {
      return;
    }

    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];
      const templateClone = template.cloneNode(true) as ExtendedHTMLElement;

      // Remote template mark
      templateClone.removeAttribute("x-template");

      // The element should be a state container itself
      templateClone.setAttribute("x-state", "");

      // Mark as a former template so that recursion (x-recurse) can find it
      templateClone.setAttribute("_x-template", "");

      // The actual state is stored to the object
      templateClone.state = { value, level };

      element.appendChild(templateClone);
    }
  };

  return renderTemplate;
}

export default eachDirective;
