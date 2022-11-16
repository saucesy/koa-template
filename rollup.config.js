import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import filesize from "rollup-plugin-filesize";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";

export default {
  input: "bin/index.js",
  output: {
    file: "dist/index.js",
    format: "cjs"
  },
  plugins: [
    resolve(),
    commonjs({
      include: "node_modules/**"
    }),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**"
    }),
    terser(),
    filesize()
  ]
};
