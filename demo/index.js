import replaceAll from "string.prototype.replaceall";
import "./index.pcss";

evaluateState();

function setState(el, newValue) {
  const bindProperty = el.dataset.bind;
  const stateContainer = el.closest("[data-state]");
  const state = parseState(stateContainer);
  const updatedState = { ...state, [bindProperty]: newValue };

  stateContainer.dataset.value = JSON.stringify(updatedState);

  evaluateBindContainers(stateContainer, updatedState);
  evaluateValueContainers(stateContainer, updatedState);
}

window.setState = setState;

function evaluateState() {
  const stateContainers = document.querySelectorAll("[data-state]");

  for (let i = stateContainers.length; i--; ) {
    const stateContainer = stateContainers[i];
    const state = parseState(stateContainer);

    stateContainer.state = state;

    evaluateBindContainers(stateContainer, state);
    evaluateValueContainers(stateContainer, state);
  }
}

function evaluateBindContainers(stateContainer, state) {
  const bindContainers = stateContainer.querySelectorAll(":scope [data-bind]");

  for (let i = bindContainers.length; i--; ) {
    const bindContainer = bindContainers[i];
    const bindProperty = bindContainer.dataset.bind;

    bindContainer[bindProperty] = state[bindProperty];
  }
}

function evaluateValueContainers(stateContainer, state) {
  const valueContainers = stateContainer.querySelectorAll(
    ":scope [data-value]"
  );

  for (let i = valueContainers.length; i--; ) {
    const valueContainer = valueContainers[i];
    const valueProperty = valueContainer.dataset.value;

    valueContainer.innerHTML = state[valueProperty];
  }
}

function parseState(element) {
  const { state } = element.dataset;

  return JSON.parse(replaceAll(state, `'`, `"`));
}
