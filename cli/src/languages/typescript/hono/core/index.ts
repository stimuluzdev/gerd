import {
  command,
  createCommand,
  getCommandValue,
  removeGitDir,
  renameFolder,
} from "@utils/index.ts";

export const scaffold = createCommand(async (args, cmd) => {
  const [, input] = getCommandValue(args, cmd);
  const name = input || (prompt("Enter project name: \n> ") as string);
  const opts = { old: "./hono-scafold", newPath: `./${name}` };

  await command("git", [
    "clone",
    "https://github.com/uriah-dev/hono-scafold.git",
  ])
  .catch((e) => console.log(e))
  .finally(() => console.log("Scaffold cloned successfully"));
  
  await renameFolder(name, opts);
  await removeGitDir(opts.newPath);
});
