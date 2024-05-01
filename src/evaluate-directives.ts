import {
  Directive,
  DirectiveFunction,
  EvaluateFrom,
  ExtendedHTMLElement,
} from "./types";
import getParents from "./get-parents";
import evaluate from "./evaluate";
import getState from "./get-state";
import setState from "./set-state";

async function evaluateDirectives(
  directives: Directive[],
  parent?: ExtendedHTMLElement
) {
  // Evaluate directives in series while resolving their values to avoid
  // race conditions.
  for await (const { name, directive } of directives) {
    await evaluateDirective(
      directives,
      name,
      directive,
      parent,
      directive.evaluateFrom
    );
  }
}

function evaluateDirective(
  directives: Directive[],
  name: string,
  directive: DirectiveFunction,
  parent?: ExtendedHTMLElement,
  evaluateFrom: EvaluateFrom = "bottom"
) {
  const elements = (parent || document.body).querySelectorAll(`[${name}]`);

  if (evaluateFrom === "top") {
    for (let i = 0; i < elements.length; i++) {
      evaluateOne(elements[i] as ExtendedHTMLElement);
    }
  } else {
    for (let i = elements.length; i--; ) {
      evaluateOne(elements[i] as ExtendedHTMLElement);
    }
  }

  function evaluateOne(element: ExtendedHTMLElement) {
    if (element.closest("[x-template]")) {
      return;
    }

    // x-if logic
    const hiddenParents = getParents(element, "hidden");
    if (hiddenParents.length > 0) {
      return;
    }

    const closestEach = name !== "x-each" && element.closest("[x-each]");

    // TODO: Simplify this logic somehow
    // If scope isn't ready, skip until a later evaluation
    if (
      name !== "x-ssr" &&
      closestEach &&
      !closestEach.getAttribute("_x-init")
    ) {
      return;
    }

    directive({
      directives,
      element: element as ExtendedHTMLElement,
      expression: element.getAttribute(name) || "",
      evaluate,
      getState,
      setState,
      evaluateDirectives,
    });
  }
}

export default evaluateDirectives;
