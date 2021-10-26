import evaluate from "./evaluate";
import getState from "./get-state";
import setState from "./set-state";

type BindState = { [id: string]: any };
type State = { [id: string]: any } | string;
type ExtendedHTMLElement = HTMLElement & {
  content: any;
  state: BindState;
  observer: MutationObserver;
  value: any;
};
type Directive = {
  name: string;
  directive: DirectiveFunction;
  evaluateFrom?: "top" | "bottom";
};
type DirectiveParameters = {
  directives: Directive[];
  element: ExtendedHTMLElement;
  expression: any;
  evaluate: typeof evaluate;
  evaluateDirectives: (
    directives: Directive[],
    element: ExtendedHTMLElement
  ) => void;
  getState: typeof getState;
  setState: typeof setState;
};

interface DirectiveFunction {
  (args: DirectiveParameters): void;
  init?: (parent: ExtendedHTMLElement) => void;
  skipEvaluation?: boolean;
}

export {
  BindState,
  State,
  ExtendedHTMLElement,
  Directive,
  DirectiveParameters,
  DirectiveFunction,
};
