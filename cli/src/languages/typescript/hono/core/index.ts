import { command, getCommandValue, renameFolder } from "@utils/index.ts";
import { type ArgsType } from "@utils/commands.ts";

export const scaffold = async (args: ArgsType, cmd: string) => {
  const [, input] = getCommandValue(args, cmd);
  const name = input || (prompt("Enter project name: \n> ") as string);
  const opts = { old: "./hono-scafold", newPath: `./${name}` };

  await command("git", [
    "clone",
    "https://github.com/uriah-dev/hono-scafold.git",
  ]);
  await renameFolder(name, opts);
  Deno.exit(0);
};
