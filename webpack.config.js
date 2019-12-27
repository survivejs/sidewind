const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const MiniHtmlWebpackPlugin = require("mini-html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgeCSSPlugin = require("purgecss-webpack-plugin");

const PATHS = {
  DEMO: path.resolve(__dirname, "demo"),
};

const commonConfig = merge({
  entry: PATHS.DEMO,
  module: {
    rules: [
      {
        test: /\.js$/,
        include: PATHS.DEMO,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.pcss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new MiniHtmlWebpackPlugin({
      filename: "index.html",
      publicPath: "/",
      context: {
        title: "Sidewind",
        htmlAttributes: { lang: "en" },
      },
    }),
  ],
});

module.exports = mode => {
  switch (mode) {
    case "development": {
      return merge(commonConfig, {
        mode,
        plugins: [new webpack.HotModuleReplacementPlugin()],
      });
    }
    case "production": {
      return merge(commonConfig, {
        mode,
        plugins: [
          new PurgeCSSPlugin({
            paths: ["./index.html"],
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
          }),
        ],
      });
    }
  }
};
