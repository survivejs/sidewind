import { ExtendedHTMLElement, State } from "../types";
import evaluateValues from "./values";

function evaluateEach(eachContainers: NodeListOf<ExtendedHTMLElement>) {
  for (let i = eachContainers.length; i--; ) {
    const eachContainer = eachContainers[i];
    const { state }: { state: State } = eachContainer.closest(
      "[x-state]"
    ) as ExtendedHTMLElement;

    if (state) {
      const containerParent = eachContainer.parentNode;
      const dataGetters = parseDataGetters(
        eachContainer.getAttribute("x-each") || ""
      );

      if (!containerParent) {
        return;
      }

      while (containerParent.firstChild) {
        containerParent.firstChild.remove();
      }

      state.forEach((item: State) => {
        const templateClone = document.importNode(eachContainer.content, true);

        evaluateValues(templateClone, getValues(item, dataGetters), "x-bind");

        containerParent.appendChild(templateClone);
      });
    }
  }
}

function parseDataGetters(pattern: string) {
  return pattern.split(",").map(part => part.trim());
}

function getValues(data: State, getters: string[]): { [id: string]: string } {
  const ret: { [id: string]: string } = {};

  getters.forEach(getter => {
    ret[getter] = data[getter];
  });

  return ret;
}

export default evaluateEach;
