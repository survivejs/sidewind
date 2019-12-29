import expressionEval from "expression-eval";
import replaceAll from "string.prototype.replaceall";

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

function initialize(global = window) {
  initializeState();

  global.setState = setState;
}

function initializeState() {
  // It's important to perform state initialization parent-first since
  // state is nested and shadowed by children.
  const stateContainers = document.querySelectorAll("[data-state]");
  const stateContainerOrder = orderByParents(Array.from(stateContainers));

  stateContainerOrder.forEach(i => {
    const stateContainer = stateContainers[i];
    const state = parseState(stateContainer);

    stateContainer.state = state;

    evaluateDOM(stateContainer, state);
  });
}

function orderByParents(elementsArray) {
  // Note that sort mutates the original structure directly
  return elementsArray
    .map((element, i) => ({
      i,
      depth: getDepth(element),
    }))
    .sort((a, b) => a.depth - b.depth)
    .map(({ i }) => i);
}

function getDepth(element, depth = 0) {
  if (element.parentNode == null) return depth;
  else return getDepth(element.parentNode, depth + 1);
}

function evaluateDOM(stateContainer, state) {
  evaluateValueContainers(stateContainer, state);
  evaluateClasses(stateContainer, state);
}

function evaluateValueContainers(stateContainer, state) {
  const valueContainers = stateContainer.querySelectorAll(
    ":scope [data-value]"
  );

  for (let i = valueContainers.length; i--; ) {
    const valueContainer = valueContainers[i];
    const valueProperty = valueContainer.dataset.value;

    valueContainer.innerHTML =
      valueProperty === "state" ? state : state[valueProperty];
  }
}

function evaluateClasses(stateContainer, state) {
  const elements = stateContainer.querySelectorAll(":scope *");

  for (let i = elements.length; i--; ) {
    const element = elements[i];
    const dataAttributes = [...element.attributes].filter(
      v =>
        v.name.startsWith("data-") &&
        ![
          "data-bind",
          "data-each",
          "data-fetch",
          "data-state",
          "data-value",
        ].includes(v.name)
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
          console.error("Failed to evaluate", value, err);
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

export { initialize };
