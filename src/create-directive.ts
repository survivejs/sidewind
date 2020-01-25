import { DirectiveType, ExtendedHTMLElement } from "./types";
import evaluateExpression from "./evaluate-expression";
import setState from "./set-state";

function createDirective(name: string, directive: DirectiveType) {
  const elements = document.querySelectorAll(`[${name}]`);

  for (let i = elements.length; i--; ) {
    const element = elements[i] as ExtendedHTMLElement;
    const expression = element.getAttribute(name) || "";
    const parameters = evaluateExpression(expression);

    directive({ element, expression, parameters, setState });
  }
}

export default createDirective;
