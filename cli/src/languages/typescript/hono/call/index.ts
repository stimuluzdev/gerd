import { command, renameFolder } from "@utils/index.ts";

export const generateSecret = async (args: {
  // deno-lint-ignore no-explicit-any
  [x: string]: any;
  _: Array<string | number>;
}) => {
  const num = args["generate"] || args["g"];
  const output = await command("openssl", ["version", "-d"]);
  if (output.includes("OPENSSLDIR")) {
    const output = await command("openssl", ["rand", "-base64", num]);
    console.log(output);
  }
  Deno.exit(0);
};

export const generateScaffold = async (args: {
  // deno-lint-ignore no-explicit-any
  [x: string]: any;
  _: Array<string | number>;
}) => {
  const name = args["name"] || args["n"] || prompt("Enter project name: \n> ") as string;
  const opts = { old: "./hono-scafold", newPath: `./${name}` };

  await command("git", [
    "clone",
    "https://github.com/uriah-dev/hono-scafold.git",
  ]);
  await renameFolder(name, opts);
  Deno.exit(0);
};
