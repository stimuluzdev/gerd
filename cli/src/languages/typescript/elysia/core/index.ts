import {
  command,
  createCommand,
  getCommandValue,
  removeGitDir,
  renameFolder,
} from "@utils/index.ts";
import {
  promptDeploymentOptions,
  runDeploymentCleanup,
} from "../sub-core/index.ts";

export const scaffold = createCommand(async (args, cmd) => {
  const [, input] = getCommandValue(args, cmd);
  const name = input || (prompt("Enter project name: \n> ") as string);
  const opts = { old: "./elysia-kit", newPath: `./${name}` };

  console.log("🚀 Cloning elysia-kit scaffold...");
  const { success, error } = await command("git", [
    "clone",
    "https://github.com/uriah-dev/elysia-kit.git",
  ]);
  if (!success) {
    console.log(error);
    return;
  }
  console.log("✅ Scaffold cloned successfully");

  await renameFolder(name, opts);
  await removeGitDir(opts.newPath);

  // Prompt user for deployment options
  const excludedDeployments = promptDeploymentOptions();

  // Run cleanup for unselected deployment options
  await runDeploymentCleanup(opts.newPath, excludedDeployments);

  console.log(`\n🎉 Project "${name}" is ready!`);
  console.log(`\nNext steps:`);
  console.log(`  cd ${name}`);
  console.log(`  cp .env.example .env`);
  console.log(`  bun install`);
  console.log(`  bun run dev`);
});
