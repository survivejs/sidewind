import {
  Directive,
  DirectiveFunction,
  EvaluateFrom,
  ExtendedHTMLElement,
} from "./types";
import evaluate from "./evaluate";
import getState from "./get-state";
import setState from "./set-state";

function evaluateDirectives(
  directives: Directive[],
  parent?: ExtendedHTMLElement
) {
  directives.forEach(
    ({ directive }) =>
      typeof directive.init === "function" &&
      directive.init(parent || (document.body as ExtendedHTMLElement))
  );

  directives.forEach(({ name, directive }) =>
    evaluateDirective(
      directives,
      name,
      directive,
      parent,
      directive.evaluateFrom
    )
  );
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
    const closestEach = name !== "x-each" && element.closest("[x-each]");

    // If scope isn't ready, skip until a later evaluation
    if (closestEach && !closestEach.getAttribute("_x-init")) {
      return;
    }

    // TODO: Work out the correct way to do this check (related to closestEach)
    if (!closestEach && element.closest("[x-template]")) {
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
