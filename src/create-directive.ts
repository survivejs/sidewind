import { DirectiveFunction, ExtendedHTMLElement } from "./types";
import evaluateExpression from "./evaluate-expression";
import setState from "./set-state";

function createDirective(name: string, directive: DirectiveFunction) {
  const elements = document.querySelectorAll(`[${name}]`);
  const resolvedElements = directive.resolveElements
    ? directive.resolveElements(elements)
    : elements;

  for (let i = resolvedElements.length; i--; ) {
    const element = elements[i] as ExtendedHTMLElement;
    const expression = element.getAttribute(name) || "";
    const parameters = evaluateExpression(expression);

    directive({ element, expression, parameters, setState });
  }
}

export default createDirective;
