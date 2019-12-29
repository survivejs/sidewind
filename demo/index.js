import expressionEval from "expression-eval";
import replaceAll from "string.prototype.replaceall";

import "highlight.js/styles/github.css";
import "./index.pcss";

evaluateState();

function setState(el, newValue) {
  const bindProperty = el.dataset.bind;
  const stateContainer = el.closest("[data-state]");
  const state = parseState(stateContainer);
  const updatedState =
    typeof state === "object"
      ? { ...state, [bindProperty]: newValue }
      : newValue;

  stateContainer.dataset.value = JSON.stringify(updatedState);

  evaluateDOM(stateContainer, updatedState);
}

window.setState = setState;

function evaluateState() {
  const stateContainers = document.querySelectorAll("[data-state]");

  for (let i = stateContainers.length; i--; ) {
    const stateContainer = stateContainers[i];
    const state = parseState(stateContainer);

    stateContainer.state = state;

    evaluateDOM(stateContainer, state);
  }
}

function evaluateDOM(stateContainer, state) {
  evaluateBindContainers(stateContainer, state);
  evaluateValueContainers(stateContainer, state);
  evaluateClasses(stateContainer, state);
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

function evaluateClasses(stateContainer, state) {
  const elements = stateContainer.querySelectorAll(":scope *");

  for (let i = elements.length; i--; ) {
    const element = elements[i];
    const dataAttributes = [...element.attributes].filter(
      v =>
        v.name.startsWith("data-") &&
        !["data-bind", "data-value"].includes(v.name)
    );

    if (dataAttributes.length > 0) {
      dataAttributes.forEach(({ name, value }) => {
        try {
          const result = expressionEval.compile(value)({ state });
          const cssPropName = name
            .split("-")
            .slice(1)
            .join("-");

          if (result) {
            element.classList.add(cssPropName);
          } else {
            element.classList.remove(cssPropName);
          }
        } catch (err) {
          console.error("Failed to evaluate", err, value);
        }
      });
    }
  }
}

function parseState(element) {
  const { state } = element.dataset;

  try {
    return JSON.parse(replaceAll(state, `'`, `"`));
  } catch {
    console.log("Failed to parse state: ", state);

    return {};
  }
}
