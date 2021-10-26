import { Directive, DirectiveFunction, ExtendedHTMLElement } from "./types";
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
    evaluateDirective(directives, name, directive, parent)
  );
}

function evaluateDirective(
  directives: Directive[],
  name: string,
  directive: DirectiveFunction,
  parent?: ExtendedHTMLElement
) {
  const elements = (parent || document.body).querySelectorAll(`[${name}]`);

  elements.forEach((element) => {
    const expression = element.getAttribute(name) || "";

    directive({
      directives,
      element: element as ExtendedHTMLElement,
      expression,
      evaluate,
      getState,
      setState,
      evaluateDirectives,
    });
  });
}

export default evaluateDirectives;
