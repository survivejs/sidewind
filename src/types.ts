import evaluateExpression from "./evaluate-expression";
import getState from "./get-state";
import setState from "./set-state";

type BindState = { [id: string]: any };
type State = { [id: string]: any } | string;
type ExtendedHTMLElement = HTMLElement & {
  content: any;
  state: BindState;
  value: any;
};
type DirectiveParameters = {
  element: ExtendedHTMLElement;
  expression: any;
  evaluate: typeof evaluateExpression;
  getState: typeof getState;
  setState: typeof setState;
};

interface DirectiveFunction {
  (args: DirectiveParameters): void;
  resolveElements?: (elements: NodeListOf<Element>) => ExtendedHTMLElement[];
}

export {
  BindState,
  State,
  ExtendedHTMLElement,
  DirectiveParameters,
  DirectiveFunction,
};
