import typescript from "rollup-plugin-typescript";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import jscc from "rollup-plugin-jscc";
import cleanup from "rollup-plugin-cleanup";
import uglify from "rollup-plugin-uglify";

const ExternalModulesList = [].concat(
	require("builtin-modules"),
	Object.keys(require("./package.json").dependencies)
);

const PLATFORM = ["web", "node"].includes(process.env.PLATFORM) ? process.env.PLATFORM : "node";
const PRODUCTION = process.env.NODE_ENV === "production";
export default {
	input: "src/Sunwell.ts",
	output: {
		format: "cjs",
		file: `dist/sunwell.${PLATFORM}${PRODUCTION ? ".min" : ""}.js`,
	},
	external: ExternalModulesList,
	name: "Sunwell",
	plugins: [
		jscc({
			values: {
				_PLATFORM: PLATFORM,
			},
			extensions: [".js", ".ts"],
		}),
		typescript({
			typescript: require("typescript"),
		}),
		resolve(),
		commonjs({
			exclude: ExternalModulesList,
			ignoreGlobal: true,
			extensions: [".js", ".ts"],
		}),
		cleanup(),
		PRODUCTION ? uglify() : undefined,
	].filter(p => p),
};
