const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
  mode: "development",
  devtool: "source-map",
  entry: "./public/assets/js/index.js",
  output: {
    path: __dirname + "/public/dist",
    filename: "bundle.js"
  },
  plugins: [
    new WebpackPwaManifest({
      fingerprints: false,
      inject: false,
      name: "Budget Tracker",
      short_name: "Budget Tracker",
      description: "An application for tracking your budget",
      background_color: "#33C7FF",
      theme_color: "#ffffff",
      start_url: "/",
      icons: [{
        src: path.resolve("public/assets/icons/icon-192x192.png"),
        sizes: [192, 512],
        destination: path.join("assets", "icons")
      }]
    })
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};
module.exports = config;