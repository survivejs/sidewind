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
  evaluateEach(stateContainer.querySelectorAll("[data-each]"));
}

function initialize(global = window) {
  evaluateState(document.querySelectorAll("[data-state]"));
  evaluateFetch(document.querySelectorAll("[data-fetch]"));
  evaluateEach(document.querySelectorAll("[data-each]"));

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
  evaluateValueContainers(stateContainer, state, "value");
  evaluateClasses(stateContainer, state);
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

function evaluateFetch(fetchContainers) {
  for (let i = fetchContainers.length; i--; ) {
    const fetchContainer = fetchContainers[i];
    const fetchTarget = fetchContainer.dataset.fetch;

    fetch(fetchTarget)
      .then(response => response.json())
      .then(state => {
        fetchContainer.dataset.state = JSON.stringify(state);
        fetchContainer.state = state;
      })
      .catch(err => {
        console.error(err);
      });
  }
}

function evaluateEach(eachContainers) {
  for (let i = eachContainers.length; i--; ) {
    const eachContainer = eachContainers[i];
    const { state } = eachContainer.closest("[data-state]");

    if (state) {
      const containerParent = eachContainer.parentNode;
      const dataPattern = eachContainer.dataset.each;
      const dataGetters = parseDataGetters(dataPattern);

      while (containerParent.firstChild) {
        containerParent.firstChild.remove();
      }

      state.forEach(item => {
        const templateClone = document.importNode(eachContainer.content, true);

        evaluateValueContainers(
          templateClone,
          getValues(item, dataGetters),
          "bind"
        );

        containerParent.appendChild(templateClone);
      });
    }
  }
}

function parseDataGetters(pattern) {
  return pattern.split(",").map(part => part.trim());
}

function getValues(data, getters) {
  const ret = {};

  getters.forEach(getter => {
    ret[getter] = data[getter];
  });

  return ret;
}

function evaluateValueContainers(stateContainer, state, valueKey) {
  const valueContainers = stateContainer.querySelectorAll(
    `:scope [data-${valueKey}]`
  );

  for (let i = valueContainers.length; i--; ) {
    const valueContainer = valueContainers[i];
    const valueProperty = valueContainer.dataset[valueKey];
    const evaluatedValue = state[valueProperty]
      ? state[valueProperty]
      : evaluateExpression(valueProperty, state) || state;

    if (valueContainer.localName === "input") {
      valueContainer.value = evaluatedValue;
    } else {
      valueContainer.innerHTML = evaluatedValue;
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
