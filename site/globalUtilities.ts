import md from "./transforms/markdown.ts";
import { urlJoin } from "https://bundle.deno.dev/https://deno.land/x/url_join@1.0.0/mod.ts";
import { tw } from "https://esm.sh/@twind/core@1.1.1";

function init() {
  async function processMarkdown(input: string) {
    return (await md(input)).content;
  }

  return { processMarkdown, tw, urlJoin };
}

export { init };
