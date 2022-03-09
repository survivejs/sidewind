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

  const hasParentEach = !!element.closest("[x-has-each]");

  // Stash state so it can be compared later to avoid work.
  // In case state is derived from another x-each, use getState(element) here.
  element.state = hasParentEach ? elementState.state : state;

  // TODO: Handle x-template="group"
  const template = element.querySelector("*[x-template='']");

  console.log(template);

  if (!template) {
    console.error("x-each - x-template was not found", element);

    return;
  }

  // Stash template for future use
  element.template = template;

  // Empty contents as they'll be replaced by applying the template
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }

  const level = getParents(element, "x-recurse").length;

  // Apply the template against each item in the collection
  state.forEach((value: any) => {
    // Copy template
    const templateClone = document.importNode(template, true);

    // The element should be a state container itself
    templateClone.setAttribute("x-state", "");

    // The actual state is stored to the object
    templateClone.state = { value, level };

    element.appendChild(templateClone);
    element.setAttribute("x-has-each", "");

    evaluateDirectives(directives, templateClone);
  });

  // Remove possible initial nodes (SSR)
  /*
  containerParent
    .querySelectorAll("*[x-initial='']")
    // @ts-ignore Skip this check
    .forEach((e: ExtendedHTMLElement) => e.remove());
  */

  // Mark container parent as a boundary for x-recurse to copy
  // element.setAttribute("_x", "");

  /*
  const level = getParents(element, "x-recurse").length;

  if (element.initializedAlready) {
    const amountOfItems = state.length;

    // Subtract template
    const amountOfChildren = containerParent.children.length - 1;

    // Create missing nodes
    if (amountOfItems > amountOfChildren) {
      for (let i = 0; i < amountOfItems - amountOfChildren; i++) {
        const templateClone = document.importNode(element.content, true);
        containerParent.appendChild(templateClone.firstElementChild);
      }
    }
    // Remove extra nodes
    if (amountOfItems < amountOfChildren) {
      for (let i = 0; i < amountOfChildren - amountOfItems; i++) {
        containerParent.lastElementChild?.remove();
      }
    }

    let child = containerParent.firstElementChild
      ?.nextElementSibling as ExtendedHTMLElement;

    state.forEach((value: any) => {
      if (child) {
        child.setAttribute("x-state", "");
        // The actual state is stored to the object
        child.state = { value, level };

        const children = findFirstChildrenWith(child, "TEMPLATE");

        children.forEach((child) => {
          if (child.parentElement) {
            (child.parentElement as ExtendedHTMLElement).state = state;
          }
        });

        evaluateDirectives(directives, child);

        child = child.nextElementSibling as ExtendedHTMLElement;
      }
    });

    if (child && state.length === 0) {
      child.remove();
    }
    // Otherwise we'll set up the initial DOM structure based on a template
    // and populate it with data that's then evaluated.
  } else {
    state.forEach((value: any) => {
      const templateClone = document.importNode(element.content, true);
      const firstChild = templateClone.firstElementChild;
      containerParent.appendChild(templateClone);
      containerParent.setAttribute("x-has-each", "");

      let child = firstChild;

      do {
        if (child) {
          // The element should be a state container itself
          child.setAttribute("x-state", "");
          // The actual state is stored to the object
          child.state = { value, level };

          evaluateDirectives(directives, child);
        }
      } while ((child = child?.nextElementSibling));
    });
  }
  */
}
eachDirective.evaluateFrom = "top";

function findFirstChildrenWith(element: Element, tagName: string) {
  let ret: ExtendedHTMLElement[] = [];

  function recurse(element: Element) {
    let child = element.firstElementChild;

    do {
      if (child?.tagName === tagName) {
        ret.push(child as ExtendedHTMLElement);
      } else if (child?.children.length) {
        recurse(child);
      }
    } while ((child = child?.nextElementSibling || null));
  }

  recurse(element);

  return ret;
}

export default eachDirective;
