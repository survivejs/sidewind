function parseState(element: HTMLElement) {
  const { state } = element.dataset;

  if (!state) {
    return;
  }

  try {
    return JSON.parse(state.replace(/'/g, '"'));
  } catch {
    console.log("Failed to parse state: ", state);

    return {};
  }
}

export { parseState };
