import type { BindState, DirectiveParameters } from "../../types.ts";

async function valueDirective({
  element,
  expression,
  getState,
  evaluateDirectives,
  directives,
}: DirectiveParameters) {
  // @ts-ignore TODO: Fix the type
  const state = await asyncEvaluate(expression, getState(element));

  if (element.localName === "input") {
    element.value = state;
  } else {
    element.innerHTML = state;

    const firstChild = element.children[0];
    const closestState = firstChild && firstChild.closest("[x-state]");

    if (closestState) {
      evaluateDirectives(directives, element);
    }
  }
}

function asyncEvaluate(expression: string, value: BindState = {}) {
  try {
    return Promise.resolve(
      Function.apply(
        null,
        Object.keys(value).concat(`return ${expression}`)
      )(...Object.values(value))
    );
  } catch (err) {
    console.error("Failed to evaluate", expression, value, err);

    return undefined;
  }
}

export default valueDirective;
