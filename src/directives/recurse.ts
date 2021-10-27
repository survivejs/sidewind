import { DirectiveParameters, ExtendedHTMLElement } from "../types";
import getParents from "../get-parents";

function recurseDirective({
  element,
  expression,
  evaluate,
  getState,
}: //evaluateDirectives,
//directives,
DirectiveParameters) {
  const state = evaluate(expression, getState(element));

  if (!Array.isArray(state)) {
    return;
  }

  const hasTemplateAlready = element.firstElementChild?.tagName === "TEMPLATE";

  if (hasTemplateAlready) {
    console.log(
      "recurse - has template already",
      expression,
      element,
      getState(element),
      state
    );

    return;
  }
  console.log("recurse - no template yet", state);

  // TODO: Likely all this has to live in x-each as it's taking care of
  // what to display
  const parents = getParents(element, "_x");
  const firstParent = parents[0];
  const template = firstParent.firstElementChild as ExtendedHTMLElement;

  if (template) {
    /*
    const templateClone = template.cloneNode(true) as ExtendedHTMLElement;

    // TODO: Once this has been created, how to remove it if data has changed?
    // Maybe some annotation is needed? templateClone.isRecursive = true
    templateClone.setAttribute("x-each", expression);
    templateClone.isRecursive = true;

    element.appendChild(templateClone);

    evaluateDirectives(directives, element);
    */
  }
}

export default recurseDirective;
