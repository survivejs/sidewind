import evaluate from "./src/evaluate.ts";
import getState from "./src/get-state.ts";
import setState from "./src/set-state.ts";

type BindState = Record<string, unknown>;
type State = BindState | string;

// TODO: Most likely this type should vanish and HTMLElement should be
// extended instead
type ExtendedHTMLElement = HTMLElement & {
  content: unknown;
  isRecursive?: boolean;
  state: BindState;
  observer: MutationObserver;
  templates?: NodeList;
  value: unknown;
};
type Directive = {
  name: string;
  directive: DirectiveFunction;
};
type DirectiveParameters = {
  directives: Directive[];
  element: ExtendedHTMLElement;
  expression: unknown;
  evaluate: typeof evaluate;
  evaluateDirectives: (
    directives: Directive[],
    element: ExtendedHTMLElement
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
