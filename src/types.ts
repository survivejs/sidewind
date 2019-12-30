type State = { [id: string]: any };
type ExtendedHTMLElement = HTMLElement & {
  content: any;
  state: State;
  value: any;
};

export { State, ExtendedHTMLElement };
