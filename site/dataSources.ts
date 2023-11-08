import { indexMarkdown } from "https://deno.land/x/gustwind@v0.39.11/site/dataSources.ts";
import markdown from "./transforms/markdown.ts";
import type { LoadApi } from "https://deno.land/x/gustwind@v0.52.3/types.ts";

function init({ load }: { load: LoadApi }) {
  async function processMarkdown(
    filename: string,
    o?: { skipFirstLine: boolean }
  ) {
    const lines = await load.textFile(filename);
    // Markdown also parses toc but it's not needed for now
    const { content } = await parseMarkdown(lines, o);

    return content;
  }

  function parseMarkdown(lines: string, o?: { skipFirstLine: boolean }) {
    return markdown(
      o?.skipFirstLine ? lines.split("\n").slice(1).join("\n") : lines
    );
  }

  return { indexMarkdown, processMarkdown };
}

export { init };
