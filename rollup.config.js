"use strict";

const path = require("path");
const buble = require("@rollup/plugin-buble");

const version = require("./package.json").version;
const banner = `/*!
 * perfect-scrollbar v${version} - mega.nz build.
 * Copyright ${new Date().getFullYear()} Hyunje Jun, MDBootstrap and Contributors
 * Licensed under MIT
 */
`;

const resolve = (_path) => path.resolve(__dirname, _path);

const outputs = [
  {
    file: resolve("dist/perfect-scrollbar.js"),
    format: "umd",
    banner,
    name: "PerfectScrollbar",
  },
];

const plugins = buble({
  target: {
    safari: 12,
    chrome: 67,
    firefox: 64,
  },
});

module.exports = outputs.map((output) => {
  return {
    input: path.resolve(__dirname, `./src/index.js`),
    output,
    plugins: [plugins],
  };
});
