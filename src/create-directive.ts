import { DirectiveFunction, ExtendedHTMLElement } from "./types";
import evaluate from "./evaluate-expression";
import setState from "./set-state";

function createDirective(name: string, directive: DirectiveFunction) {
  const elements = document.querySelectorAll(`[${name}]`);
  const resolvedElements = directive.resolveElements
    ? directive.resolveElements(elements)
    : elements;

  for (let i = resolvedElements.length; i--; ) {
    const element = elements[i] as ExtendedHTMLElement;
    const expression = element.getAttribute(name) || "";

    directive({ element, expression, evaluate, setState });
  }
}

export default createDirective;
