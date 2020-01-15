import { BindState, ExtendedHTMLElement } from "../types";
import { getValues } from "../utils";
import setState from "../set-state";

function evaluateEach(
  eachContainers: NodeListOf<ExtendedHTMLElement>,
  eachKey: string,
  stateKey: string
) {
  for (let i = eachContainers.length; i--; ) {
    const eachContainer = eachContainers[i];
    const { state }: { state: BindState } = eachContainer.closest(
      `[${stateKey}]`
    ) as ExtendedHTMLElement;

    if (state) {
      const containerParent = eachContainer.parentNode;

      if (!containerParent) {
        return;
      }

      // It would be better to diff for changes instead of replacing
      // all nodes.
      while (containerParent.firstChild) {
        containerParent.firstChild.remove();
      }
      containerParent.appendChild(eachContainer);

      if (typeof state === "object") {
        Object.values(
          getValues(state, eachContainer.getAttribute(eachKey))
        ).forEach(
          values =>
            Array.isArray(values) &&
            values.forEach((value: any) => {
              const templateClone = document.importNode(
                eachContainer.content,
                true
              );
              const firstChild = templateClone.firstElementChild;

              firstChild.setAttribute(stateKey, JSON.stringify(value));
              containerParent.appendChild(templateClone);

              setState(value, firstChild);
            })
        );
      }
    }
  }
}

export default evaluateEach;
