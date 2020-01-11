const fs = require("fs");
const path = require("path");
const temp = require("temp");
const { highlightAuto } = require("highlight.js");
const showdown = require("showdown");
const decodeHTML = require("html-encoder-decoder").decode;
const webpack = require("webpack");
const merge = require("webpack-merge");
const CopyPlugin = require("copy-webpack-plugin");
const MiniHtmlWebpackPlugin = require("mini-html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgeCSSPlugin = require("purgecss-webpack-plugin");

const PATHS = {
  ASSETS: path.resolve(__dirname, "assets"),
  DEMO: path.resolve(__dirname, "demo"),
  SRC: path.resolve(__dirname, "src"),
  OUTPUT: path.resolve(__dirname, "docs"),
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
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
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
    new CopyPlugin([{ from: PATHS.ASSETS, to: "assets" }]),
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
        const {
          generateAttributes,
          generateCSSReferences,
          generateJSReferences,
        } = MiniHtmlWebpackPlugin;
        const htmlAttrs = generateAttributes(htmlAttributes);

        const cssTags = generateCSSReferences({
          files: css,
          attributes: cssAttributes,
          publicPath,
        });

        const jsTags = generateJSReferences({
          files: js,
          attributes: jsAttributes,
          publicPath,
        });

        return getHTML({ title, htmlAttrs, cssTags, jsTags });
      },
    }),
  ],
});

function processMarkdown(input) {
  const classMap = { a: "underline", ul: "list-disc list-inside" };
  const bindings = Object.keys(classMap).map(key => ({
    type: "output",
    regex: new RegExp(`<${key}(.*)>`, "g"),
    replace: `<${key} class="${classMap[key]}" $1>`,
  }));
  const convert = new showdown.Converter({
    extensions: [
      ...bindings,
      expandCode(),
      addHeaderAnchors("h2"),
      addHeaderAnchors("h3"),
    ],
  });

  // TODO: Deal with the code sections
  return convert.makeHtml(input);
}

function addHeaderAnchors(tag) {
  return {
    type: "output",
    regex: new RegExp(`<${tag} id="(.*)">(.*)<\/${tag}>`, "g"),
    replace: `<${tag} id="$1"><span class="heading-text">$2</span><a class="ml-2 text-gray-200 hover:text-gray-800" href="#$1">#</a></${tag}>`,
  };
}

function expandCode() {
  return {
    type: "output",
    filter(text) {
      const left = "<pre><code\\b[^>]*>",
        right = "</code></pre>",
        flags = "g",
        replacement = (_, match, left, right) => {
          const example = decodeHTML(match);
          const code = left + highlightAuto(example).value + right;

          return `<section class="mb-4" x-state="'code'">
  <nav class="flex flex-row justify-between">
    <div
      class="p-2 w-full"
      x-case="code"
      x-on="bg-gray-200"
      x-off="btn-muted"
      onclick="setState('code')"
    >
      Code
    </div>
    <div
      class="p-2 w-full"
      x-case="example"
      x-on="bg-gray-200"
      x-off="btn-muted"
      onclick="setState('example')"
    >
      Example
    </div>
  </nav>
  <div class="bg-gray-100 p-2">
    <div x-case="code" x-off="hidden">${code}</div>
    <div x-case="example" x-off="hidden">${example}</div>
  </div>
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

class AddDependencyPlugin {
  constructor(options = {}) {
    this.options = options;
    this.plugin = this.plugin.bind(this);
  }

  plugin(compilation, callback) {
    const { path } = this.options;

    compilation.fileDependencies.add(path);

    callback();
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync("AddDependencyPlugin", this.plugin);
  }
}

module.exports = mode => {
  switch (mode) {
    case "development": {
      return merge(commonConfig, {
        mode,
        plugins: [
          new AddDependencyPlugin({
            path: path.join(__dirname, "./README.md"),
          }),
          new webpack.HotModuleReplacementPlugin(),
        ],
      });
    }
    case "production": {
      const fileStream = temp.createWriteStream();
      fileStream.write(getHTML());
      fileStream.end();

      return merge(commonConfig, {
        mode,
        plugins: [
          new PurgeCSSPlugin({
            paths: [fileStream.path],
            extractors: [
              {
                extractor: class TailwindExtractor {
                  static extract(content) {
                    return content.match(/[A-Za-z0-9-_:/]+/g) || [];
                  }
                },
                extensions: ["html"],
              },
            ],
            // TODO: Extract these from data attributes
            whitelist: ["btn-muted", "btn-bg-gray-200", "hidden"],
          }),
        ],
      });
    }
  }
};

function getHTML({
  title = "",
  htmlAttrs = "",
  cssTags = "",
  jsTags = "",
} = {}) {
  return `<!DOCTYPE html>
  <html${htmlAttrs}>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>${title}</title>
      ${cssTags}
    </head>
    <body>
      ${githubCorner("https://github.com/bebraw/sidewind")}
      <main class="container mx-auto p-8">
        ${processMarkdown(
          fs.readFileSync("./README.md", { encoding: "utf-8" })
        )}
      </main>
      ${jsTags}
    </body>
  </html>`;
}

// http://tholman.com/github-corners/
function githubCorner(url) {
  return `<a href="${url}" class="github-corner" aria-label="View source on GitHub"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>`;
}
