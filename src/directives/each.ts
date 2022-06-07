import { getLevel, getTemplates } from "../utils";
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
  // @ts-ignore TODO: Fix the type
  const state = evaluate(expression, elementState) || [];

  if (!Array.isArray(state)) {
    console.error(
      "x-each - Evaluated expression does not yield an array",
      expression,
      element
    );

    return;
  }

  // @ts-ignore TODO: Fix the type. Probably some type above is wrong
  if (state === element.state) {
    return;
  }

  const level = getLevel(element);
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

    state.forEach((value: unknown) => {
      for (let i = 0; i < amountOfTemplates; i++) {
        if (child) {
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
      const renderTemplate = getTemplateRenderer(
        element,
        element.templates,
        level
      );
      const missingState = state.slice(amountOfChildren / amountOfTemplates);

      for (let i = 0; i < amountOfExtraNodes / amountOfTemplates; i++) {
        renderTemplate(missingState[i]);
      }
    }

    // Set the changed state
    // @ts-ignore TODO: Fix the type
    element.state = state;
  } else {
    const hasParentEach = !!element.closest("[x-has-each]");

    // Stash state so it can be compared later to avoid work.
    // In case state is derived from another x-each, use getState(element) here.
    // @ts-ignore TODO: Fix the type
    element.state = hasParentEach ? elementState.state : state;

    let templates = getTemplates(element);

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

    // Empty contents as they'll be replaced by applying the template
    while (element.firstChild) {
      element.lastChild && element.removeChild(element.lastChild);
    }

    const renderTemplate = getTemplateRenderer(element, templates, level);

    state.forEach(renderTemplate);
  }

  evaluateDirectives(directives, element);
}
eachDirective.evaluateFrom = "top";

function getTemplateRenderer(
  element: ExtendedHTMLElement,
  templates: ExtendedHTMLElement["templates"],
  level: number
) {
  const renderTemplate = (value: unknown) => {
    if (!templates) {
      return;
    }

    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];
      const templateClone = template.cloneNode(true) as ExtendedHTMLElement;

      // Remote template mark
      templateClone.removeAttribute("x-template");

      // The element should be a state container itself so that children can
      // access its data.
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
