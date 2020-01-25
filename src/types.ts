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
  parameters: any;
  setState: typeof setState;
};
type DirectiveType = (args: DirectiveParameters) => any;

export {
  BindState,
  State,
  ExtendedHTMLElement,
  DirectiveParameters,
  DirectiveType,
};
