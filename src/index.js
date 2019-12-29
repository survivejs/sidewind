import expressionEvaluator from "expression-eval";
import replaceAll from "string.prototype.replaceall";

function setState(el, newValue) {
  const stateContainer = el.closest("[data-state]");
  const state = parseState(stateContainer);

  const updatedState =
    typeof state === "object" ? { ...state, ...newValue } : newValue;

  el.state = updatedState;

  stateContainer.dataset.state = JSON.stringify(updatedState);

  evaluateDOM(stateContainer, updatedState);
  evaluateState(stateContainer.querySelectorAll("[data-state]"));
}

function initialize(global = window) {
  evaluateState(document.querySelectorAll("[data-state]"));

  global.setState = setState;
}

function evaluateState(stateContainers) {
  // It's important to perform state initialization parent-first since
  // state is nested and shadowed by children.
  const stateContainerOrder = orderByParents(Array.from(stateContainers));

  stateContainerOrder.forEach(i => {
    const stateContainer = stateContainers[i];
    const state = parseState(stateContainer);

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
    const evaluatedValue = state[valueProperty]
      ? state[valueProperty]
      : evaluateExpression(valueProperty, state) || state;

    valueContainer.innerHTML = evaluatedValue;
  }
}

function evaluateClasses(stateContainer, state) {
  const elements = stateContainer.querySelectorAll(":scope *");

  for (let i = elements.length; i--; ) {
    const element = elements[i];
    const dataAttributes = [...element.attributes].filter(
      v =>
        v.name.startsWith("data-") &&
        !["data-each", "data-fetch", "data-state", "data-value"].includes(
          v.name
        )
    );

    if (dataAttributes.length > 0) {
      dataAttributes.forEach(({ name, value }) => {
        const result = evaluateExpression(value, { state });

        if (typeof result === "undefined") {
          return;
        }

        const cssPropName = name
          .split("-")
          .slice(1)
          .join("-");

        if (result) {
          element.classList.add(cssPropName);
        } else {
          element.classList.remove(cssPropName);
        }
      });
    }
  }
}

function evaluateExpression(expression, value) {
  try {
    return expressionEvaluator.compile(expression)(value);
  } catch (err) {
    console.error("Failed to evaluate", value, err);
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
