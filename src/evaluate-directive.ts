import { DirectiveFunction, ExtendedHTMLElement } from "./types";
import evaluate from "./evaluate";
import getState from "./get-state";
import setState from "./set-state";

function evaluateDirective(name: string, directive: DirectiveFunction) {
  const elements = document.querySelectorAll(`[${name}]`);
  const resolvedElements = directive.resolveElements
    ? directive.resolveElements(elements)
    : elements;

  for (let i = resolvedElements.length; i--; ) {
    const element = elements[i] as ExtendedHTMLElement;
    const expression = element.getAttribute(name) || "";

    directive({ element, expression, evaluate, getState, setState });
  }
}

export default evaluateDirective;
