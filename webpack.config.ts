import webpack from "webpack";
import type {
  Configuration,
  Compilation,
  WebpackPluginInstance,
} from "webpack";
import fs from "fs";
import path from "path";
import temp from "temp";
import { createInstance, virtualInjector } from "beamwind";
import tailwind from "@beamwind/preset-tailwind";
import showdown from "showdown";
import { merge } from "webpack-merge";
import { WebpackPluginServe } from "webpack-plugin-serve";
import CopyPlugin from "copy-webpack-plugin";
import {
  MiniHtmlWebpackPlugin,
  generateAttributes,
  generateCSSReferences,
  generateJSReferences,
} from "mini-html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

// Is this the right place or should this be controlled per render?
const injector = virtualInjector();
const { setup, bw } = createInstance({ injector });

setup(tailwind());

const decodeHTML = require("html-encoder-decoder").decode;
const { mode } = require("webpack-nano/argv");

const PATHS = {
  ASSETS: path.resolve(__dirname, "assets"),
  DEMO: path.resolve(__dirname, "demo"),
  SRC: path.resolve(__dirname, "src"),
  OUTPUT: path.resolve(__dirname, "public"),
};

const commonConfig = merge({
  entry: PATHS.DEMO,
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [PATHS.DEMO, PATHS.SRC],
        use: {
          loader: "ts-loader",
          options: {
            compilerOptions: {
              declaration: false,
            },
          },
        },
      },
      {
        test: /\.(css|pcss)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    path: PATHS.OUTPUT,
  },
  plugins: [
    new CopyPlugin({ patterns: [{ from: PATHS.ASSETS, to: "assets" }] }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new MiniHtmlWebpackPlugin({
      filename: "index.html",
      context: {
        title: "Sidewind",
        htmlAttributes: { lang: "en" },
      },
      template: ({
        css,
        js,
        publicPath,
        title,
        htmlAttributes,
        cssAttributes,
        jsAttributes,
      }) => {
        const htmlAttrs = generateAttributes(htmlAttributes);

        const cssTags = generateCSSReferences({
          files: css || [],
          attributes: cssAttributes,
          publicPath,
        });

        const jsTags = generateJSReferences({
          files: js || [],
          attributes: jsAttributes,
          publicPath,
        });

        return getHTML({ title, htmlAttrs, cssTags, jsTags });
      },
    }),
  ],
});

function processMarkdown(input: string) {
  const classMap = { a: "underline", ul: "list-disc list-inside" };
  const bindings = Object.keys(classMap).map((key: string) => ({
    type: "output",
    regex: new RegExp(`<${key}(.*)>`, "g"),
    // @ts-ignore: No index signature with a parameter of type 'string' was found
    replace: `<${key} class="${bw(classMap[key])}" $1>`,
  }));
  const convert = new showdown.Converter({
    extensions: [
      ...bindings,
      expandCode(),
      styleH1(),
      addHeadingAnchors("h2"),
      addHeadingAnchors("h3"),
    ],
  });

  // TODO: Deal with the code sections
  return convert.makeHtml(input);
}

function styleH1() {
  const tag = "h1";

  return {
    type: "output",
    regex: new RegExp(`<${tag} id="(.*)">(.*)<\/${tag}>`, "g"),
    replace: `<${tag} class="${bw(
      "mb-8 pb-2 text-4xl border-b-4"
    )}">$2</${tag}>`,
  };
}

function addHeadingAnchors(tag: string) {
  return {
    type: "output",
    regex: new RegExp(`<${tag} id="(.*)">(.*)<\/${tag}>`, "g"),
    replace: `<div><${tag} class="${bw(
      "inline"
    )}" id="$1">$2</${tag}><a class="${bw(
      "ml-2 text-gray-200 hover:text-gray-800"
    )}" href="#$1">#</a></div>`,
  };
}

function expandCode() {
  return {
    type: "output",
    filter(text: string) {
      const left = "<pre><code\\b[^>]*>",
        right = "</code></pre>",
        flags = "g",
        replacement = (_: any, match: string) => {
          const example = decodeHTML(match).trim();
          const decodedExample = Buffer.from(example).toString("base64");

          return `<section class="${bw(
            "mb-4"
          )}" x-state="{ code: atob('${decodedExample}') }">
    <div class="${bw(
      "p-4 bg-gray-800 text-white rounded-t-lg overflow-x-auto overflow-y-hidden"
    )}">
      <div class="${bw("inline-block font-mono relative")}">
        <pre class="${bw(
          "overflow-hidden mr-16 pr-16 w-full"
        )}" x="highlight('html', state.code)"></pre>
        <textarea
          class="${bw(
            "overflow-hidden absolute min-w-full top-0 left-0 outline-none opacity-50 bg-none whitespace-pre resize-none"
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
    <div class="${bw(
      "p-4 bg-gray-200 rounded-b-lg"
    )}" x="state.code">${example}</div>
</section>`;
        };
      return showdown.helper.replaceRecursiveRegExp(
        text,
        replacement,
        left,
        right,
        flags
      );
    },
  };
}

type Options = {
  path: string;
};

class AddDependencyPlugin implements WebpackPluginInstance {
  private options: Options;

  constructor(options: Options) {
    this.options = options;
    this.plugin = this.plugin.bind(this);
  }

  plugin(compilation: Compilation, callback: () => void) {
    const { path } = this.options;

    compilation.fileDependencies.add(path);

    callback();
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.emit.tapAsync("AddDependencyPlugin", this.plugin);
  }
}

const getConfig = (mode: Configuration["mode"]): Configuration => {
  switch (mode) {
    case "development": {
      return merge<Configuration>(commonConfig, {
        mode,
        watch: true,
        plugins: [
          new WebpackPluginServe({
            port: parseInt(process.env.PORT || "") || 8080,
            static: PATHS.OUTPUT,
            liveReload: true,
            waitForBuild: true,
          }),
          new AddDependencyPlugin({
            path: path.join(__dirname, "./README.md"),
          }),
        ],
      });
    }
    case "production": {
      const htmlDir = temp.mkdirSync(".templates");

      fs.writeFileSync(path.join(htmlDir, "index.html"), getHTML());

      return merge<Configuration>(commonConfig, { mode });
    }
  }

  throw new Error("Matching configuration was not found!");
};

module.exports = getConfig(mode);

function getHTML({
  title = "",
  htmlAttrs = "",
  cssTags = "",
  jsTags = "",
} = {}) {
  const styleTag = "STYLE_TAG";
  const markup = `<!DOCTYPE html>
  <html${htmlAttrs}>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>${title}</title>
      ${cssTags}
      <link rel="stylesheet"
      href="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.1.2/build/styles/dracula.min.css">
      <script src="unpkg.com/@beamwind/play@2.1.1/script/play.js"></script>
      <script src="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.1.2/build/highlight.min.js"></script>
      <script charset="UTF-8" src="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.1.2/build/languages/javascript.min.js"></script>
      <script charset="UTF-8" src="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.1.2/build/languages/xml.min.js"></script>
      ${styleTag}
    </head>
    <body>
      ${githubCorner("https://github.com/survivejs/sidewind")}
      <main class="${bw("flex m-8")}">
        <aside class="${bw("hidden md:inline md:w-1/3")}">
          <nav
            class="${bw("sticky top-0")}"
            x-label="parent"
            x-state="{ closest: {}, headings: Array.from(document.querySelectorAll('h2, h3')) }"
            x-closest="{ state: { closest: document.querySelectorAll('h2, h3') } }"
          >
            <ul>
              <template x-each="headings">
                <li>
                  <a
                    x-href="state.nextElementSibling.attributes.href.value"
                    x="state.textContent"
                    x-class="[
                      state.textContent === parent.closest.textContent && '${bw(
                        "font-bold"
                      )}',
                      state.tagName === 'H3' && '${bw("ml-2")}'
                    ]"
                  >
                  </a>
                </li>
              </template>
            </ul>
          </nav>
        </aside>
        <article class="${bw("w-full md:w-2/3 md:max-w-2xl")}">
          ${processMarkdown(
            fs.readFileSync("./README.md", { encoding: "utf-8" })
          )}
        </article>
      </main>
      ${jsTags}
    </body>
  </html>`;

  return markup.replace(
    styleTag,
    `<style id="__beamwind">${injector.target.join("\n")}</style>`
  );
}

// http://tholman.com/github-corners/
function githubCorner(url: string) {
  return `<a href="${url}" class="github-corner fixed top-0 right-0" aria-label="View source on GitHub"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>`;
}
