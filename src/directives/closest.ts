import { ExtendedHTMLElement } from "../types";

function evaluateClosest(closestContainers: NodeListOf<ExtendedHTMLElement>) {
  for (let i = closestContainers.length; i--; ) {
    const closestContainer = closestContainers[i] as ExtendedHTMLElement;

    console.log(closestContainer);

    // TODO: Set up logic
  }
}

export default evaluateClosest;
