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
  const state = evaluate(expression, getState(element));
  const containerParent = element.parentElement as ExtendedHTMLElement;

  if (!containerParent || !Array.isArray(state)) {
    return;
  }

  if (state === containerParent.state) {
    /*console.log(
      "same state, skipping",
      getState(element),
      expression,
      state,
      element.isRecursive
    );*/

    return;
  }
  /*console.log(
    "different state",
    getState(element),
    expression,
    state,
    element.isRecursive
  );*/

  // Stash state so it can be compared later to avoid work
  containerParent.state = state;

  const initializedAlready = containerParent.children.length > 1;

  // Mark container parent as a boundary for x-recurse to copy
  containerParent.setAttribute("_x", "");

  const level = getParents(element, "x-recurse").length;

  // TODO: Handle x-recurse and recursion here as well
  // If we had initialized already, then it's important to update state
  // per each item and handle possible additions and removals
  if (initializedAlready) {
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
        containerParent.lastChild?.remove();
      }
    }

    let child = containerParent.firstElementChild
      ?.nextElementSibling as ExtendedHTMLElement;

    // Update nodes
    state.forEach((value: any) => {
      if (child) {
        // console.log("updating child", child, value);

        // The element should be a state container itself
        child.setAttribute("x-state", "");
        // The actual state is stored to the object
        child.state = { value, level };

        // Is it better to trigger this only once against the container?
        evaluateDirectives(directives, child);

        let childOfChild = child.firstElementChild as ExtendedHTMLElement;

        do {
          if (childOfChild) {
            // @ts-ignore
            console.log("child of child", childOfChild, childOfChild.state);

            // TODO: If there's anything with a template, erase its siblings
            // childOfChild.remove(); // XXX

            // XXXXX: This removes too much now. Likely the trick is to reuse
            // the original template somehow and remove anything that's not in it
            //let c;
            //while ((c = childOfChild.nextElementSibling)) {
            //console.log(c.tagName);
            //c.remove();
            // c.state = state;
            //}
          }
        } while (
          (childOfChild = childOfChild?.nextElementSibling as ExtendedHTMLElement)
        );

        child = child.nextElementSibling as ExtendedHTMLElement;
      }
    });
    // Otherwise we'll set up the initial DOM structure based on a template
    // and populate it with data that's then evaluated.
  } else {
    state.forEach((value: any) => {
      const templateClone = document.importNode(element.content, true);
      const firstChild = templateClone.firstElementChild;
      containerParent.appendChild(templateClone);

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
}
eachDirective.evaluateFrom = "top";

export default eachDirective;
