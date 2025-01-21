// Reference: https://github.com/souporserious/bundling-typescript-with-esbuild-for-npm

const { build } = require("esbuild");
const { dependencies, peerDependencies } = require("./package.json");

const entryFile = "src/index.ts";
const shared = {
  bundle: true,
  entryPoints: [entryFile],
  external: [...Object.keys(dependencies), ...Object.keys(peerDependencies)],
  logLevel: "info",
  //  minify: true,
  sourcemap: true,
  loader: {
    ".js": "jsx",
  },
};

build({
  ...shared,
  format: "esm",
  outfile: "./dist/index.esm.js",
  target: ["esnext", "node12.22.0"],
});

build({
  ...shared,
  format: "cjs",
  outfile: "./dist/index.cjs.js",
  target: ["esnext", "node12.22.0"],
});
