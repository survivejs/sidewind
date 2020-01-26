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
      typeof directive.init === "function" && directive.init(parent || document)
  );

  directives.forEach(({ name, directive }) =>
    evaluateDirective(directives, name, directive, parent)
  );
}

function evaluateDirective(
  directives: Directive[],
  name: string,
  directive: DirectiveFunction,
  parent?: ExtendedHTMLElement | Document
) {
  const elements = (parent || document).querySelectorAll(`[${name}]`);
  const resolvedElements = directive.resolveElements
    ? directive.resolveElements(elements)
    : elements;

  for (let i = resolvedElements.length; i--; ) {
    const element = elements[i] as ExtendedHTMLElement;
    const expression = element.getAttribute(name) || "";

    directive({
      directives,
      element,
      expression,
      evaluate,
      getState,
      setState,
      evaluateDirectives,
    });
  }
}

export default evaluateDirectives;
