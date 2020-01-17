import { ExtendedHTMLElement } from "./types";

function generateAttributeKeys(
  stateContainers: ExtendedHTMLElement[],
  attributeKey: string,
  valueKey: string
) {
  stateContainers.forEach(stateContainer =>
    Array.from(stateContainer.querySelectorAll("*"))
      .concat(stateContainer)
      .forEach(element => {
        const attributes = Array.from(element.attributes);

        attributes.some(attribute => attribute.name.startsWith(valueKey)) &&
          element.setAttribute(attributeKey, "");
      })
  );
}

export default generateAttributeKeys;
