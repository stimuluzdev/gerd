import { command, renameFolder } from "@utils/index.ts";

export const scaffold = async (args: {
  // deno-lint-ignore no-explicit-any
  [x: string]: any;
  _: Array<string | number>;
}) => {
  const name = args["name"] || args["n"] ||
    prompt("Enter project name: \n> ") as string;
  const opts = { old: "./hono-scafold", newPath: `./${name}` };

  await command("git", [
    "clone",
    "https://github.com/uriah-dev/hono-scafold.git",
  ]);
  await renameFolder(name, opts);
  Deno.exit(0);
};
