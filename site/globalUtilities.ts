import md from "./transforms/markdown.ts";
import { tw } from "https://esm.sh/@twind/core@1.1.1";

function init() {
  async function processMarkdown(input: string) {
    return (await md(input)).content;
  }

  return { processMarkdown, tw };
}

export { init };
