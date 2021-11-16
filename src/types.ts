import evaluate from "./evaluate.ts";
import getState from "./get-state.ts";
import setState from "./set-state.ts";

type BindState = { [id: string]: unknown };
type State = { [id: string]: unknown } | string;
type ExtendedHTMLElement = HTMLElement & {
  content: unknown;
  isRecursive?: boolean;
  state: BindState;
  observer: MutationObserver;
  value: unknown;
};
type Directive = {
  name: string;
  directive: DirectiveFunction;
};
type DirectiveParameters = {
  directives: Directive[];
  element: ExtendedHTMLElement;
  expression: string;
  evaluate: typeof evaluate;
  evaluateDirectives: (
    directives: Directive[],
    element: ExtendedHTMLElement,
  ) => void;
  getState: typeof getState;
  setState: typeof setState;
};

type EvaluateFrom = "top" | "bottom";

interface DirectiveFunction {
  (args: DirectiveParameters): void;
  init?: (parent: ExtendedHTMLElement) => void;
  skipEvaluation?: boolean;
  evaluateFrom?: EvaluateFrom;
}

export type {
  BindState,
  Directive,
  DirectiveFunction,
  DirectiveParameters,
  EvaluateFrom,
  ExtendedHTMLElement,
  State,
};
