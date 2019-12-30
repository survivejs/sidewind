function parseState(element: HTMLElement) {
  const state = element.getAttribute("x-state");

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
