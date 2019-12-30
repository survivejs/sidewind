type BindState = { [id: string]: any };
type State = { [id: string]: any } | string;
type ExtendedHTMLElement = HTMLElement & {
  content: any;
  state: BindState;
  value: any;
};

export { BindState, State, ExtendedHTMLElement };
