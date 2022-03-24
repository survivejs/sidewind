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

    let templates = element.querySelectorAll(":scope > *[x-template]");

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
