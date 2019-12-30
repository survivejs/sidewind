import { ExtendedHTMLElement } from "../types";

function evaluateFetch(fetchContainers: NodeListOf<ExtendedHTMLElement>) {
  for (let i = fetchContainers.length; i--; ) {
    const fetchContainer = fetchContainers[i];
    const fetchTarget = fetchContainer.getAttribute("x-fetch");

    if (!fetchTarget) {
      return;
    }

    fetch(fetchTarget)
      .then(response => response.json())
      .then(state => {
        fetchContainer.setAttribute("x-state", JSON.stringify(state));
        fetchContainer.state = state;
      })
      .catch(err => {
        console.error(err);
      });
  }
}

export default evaluateFetch;
