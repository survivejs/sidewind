import { parse } from "https://deno.land/x/frontmatter@v0.1.4/mod.ts";
import { dir } from "https://deno.land/x/gustwind@v0.39.11/utilities/fs.ts";
import markdown from "./transforms/markdown.ts";
import type { LoadApi } from "https://deno.land/x/gustwind@v0.52.3/types.ts";

type MarkdownWithFrontmatter = {
  data: {
    slug: string;
    title: string;
    date: Date;
    keywords: string[];
  };
  content: string;
};

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

  async function indexMarkdown(
    directory: string,
    o?: { skipFirstLine: boolean }
  ) {
    const files = await dir({ path: directory, extension: ".md" });

    return Promise.all(
      files.map(({ path }) =>
        Deno.readTextFile(path).then((d) => parseHeadmatter(d, o))
      )
    );
  }

  function parseHeadmatter(
    s: string,
    o?: { skipFirstLine: boolean }
  ): MarkdownWithFrontmatter {
    const ret = parse(s);

    return {
      ...ret,
      content: parseMarkdown(ret.content, o).content,
    } as MarkdownWithFrontmatter;
  }

  return { indexMarkdown, processMarkdown };
}

export { init };
