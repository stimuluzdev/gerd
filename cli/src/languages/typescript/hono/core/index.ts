import {
  command,
  createCommand,
  getCommandValue,
  renameFolder,
} from "@utils/index.ts";

export const scaffold = createCommand(async (args, cmd) => {
  const [, input] = getCommandValue(args, cmd);
  const name = input || (prompt("Enter project name: \n> ") as string);
  const opts = { old: "./hono-scafold", newPath: `./${name}` };

  await command("git", [
    "clone",
    "https://github.com/uriah-dev/hono-scafold.git",
  ]);
  await renameFolder(name, opts);
});
