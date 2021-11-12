import { marked } from "https://unpkg.com/marked@4.0.0/lib/marked.esm.js";
import { tw } from "https://cdn.skypack.dev/twind@0.16.16?min";
import { HighlightJS as highlight } from "https://cdn.skypack.dev/highlight.js@11.3.1?min";
import highlightJS from "https://unpkg.com/highlight.js@11.3.1/es/languages/javascript";
import highlightJSON from "https://unpkg.com/highlight.js@11.3.1/es/languages/json";
import highlightTS from "https://unpkg.com/highlight.js@11.3.1/es/languages/typescript";
import { Html5Entities } from "https://deno.land/x/html_entities@v1.0/mod.js";

highlight.registerLanguage("javascript", highlightJS);
highlight.registerLanguage("js", highlightJS);
highlight.registerLanguage("json", highlightJSON);
highlight.registerLanguage("typescript", highlightTS);
highlight.registerLanguage("ts", highlightTS);

marked.setOptions({
  gfm: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: true,
  highlight: (code: string, language: string) => {
    return highlight.highlight(code, { language }).value;
  },
});

function transformMarkdown(input: string) {
  // https://github.com/markedjs/marked/issues/545
  const tableOfContents: { slug: string; level: number; text: string }[] = [];

  // https://marked.js.org/using_pro#renderer
  // https://github.com/markedjs/marked/blob/master/src/Renderer.js
  marked.use({
    renderer: {
      code(code: string) {
        return renderEditor(code);
      },
      paragraph(text) {
        return '<p class="' + tw("my-2") + '">' + text + "</p>";
      },
      heading(
        text: string,
        level: number,
        raw: string,
        slugger: { slug: (s: string) => string }
      ) {
        const slug = slugger.slug(raw);

        tableOfContents.push({ slug, level, text });

        const classes = {
          1: "inline-block underline text-gray-900 font-extrabold leading-3 text-3xl mt-0 mb-8",
          2: "inline-block underline text-gray-900 font-bold leading-4 text-xl mt-4 mb-2",
          3: "inline-block underline text-gray-900 font-semibold leading-5 text-lg mt-1 mb-1",
          4: "inline-block underline text-gray-900 font-medium leading-6 mt-1 mb-0.5",
        };

        return (
          '<a class="' +
          tw(classes[level]) +
          '" href="#' +
          slug +
          '"><h' +
          level +
          ' class="' +
          tw`inline` +
          '"' +
          ' id="' +
          slug +
          '">' +
          text +
          "</h" +
          level +
          ">" +
          "</a>\n"
        );
      },
      link(href: string, title: string, text: string) {
        if (href === null) {
          return text;
        }
        let out = '<a class="' + tw`underline` + '" href="' + href + '"';
        if (title) {
          out += ' title="' + title + '"';
        }
        out += ">" + text + "</a>";
        return out;
      },
      list(body: string, ordered: string, start: number) {
        const type = ordered ? "ol" : "ul",
          startatt = ordered && start !== 1 ? ' start="' + start + '"' : "",
          klass = ordered
            ? "list-decimal list-outside my-2"
            : "list-disc list-outside my-2";
        return (
          "<" +
          type +
          startatt +
          ' class="' +
          tw(klass) +
          '">\n' +
          body +
          "</" +
          type +
          ">\n"
        );
      },
    },
  });

  return { content: marked(input), tableOfContents };
}

function renderEditor(input: string) {
  const example = Html5Entities.decode(input);

  return `<section class="${tw("mb-4")}" x-state="{ code: atob('${btoa(
    example
  )}') }">
<div class="${tw(
    "p-4 bg-gray-800 text-white rounded-t-lg overflow-x-auto overflow-y-hidden"
  )}">
<div class="${tw("relative")}">
  <div class="${tw(
    "absolute right-0 text-xs font-thin select-none text-white"
  )}">Editor</div>
</div>
<div class="${tw("inline-block font-mono relative")}">
  <pre class="${tw(
    "overflow-hidden mr-16 pr-16 w-full"
  )}" x="highlight('html', state.code)"></pre>
  <textarea
    class="${tw(
      "overflow-hidden absolute min-w-full top-0 left-0 outline-none opacity-50 bg-transparent whitespace-pre resize-none"
    )}"
    oninput="setState({ code: this.value })"
    x="state.code"
    autocapitalize="off"
    autocomplete="off"
    autocorrect="off"
    spellcheck="false"
    x-rows="state.code.split('\\n').length"
  ></textarea>
</div>
</div>
<div class="${tw(
    "p-4 bg-gray-200 rounded-b-lg"
  )}" x="state.code">${example}</div>
</section>`;
}

export default transformMarkdown;
