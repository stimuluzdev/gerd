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

  const setupType = prompt(
    "Choose setup type:\n  1. Minimal (lightweight starter)\n  2. Advanced (full features with deployment options)\n> "
  ) as string;
  const isAdvanced = setupType === "2" || setupType.toLowerCase() === "advanced";

  const repoUrl = isAdvanced
    ? "https://github.com/uriah-dev/elysia-kit.git"
    : "https://github.com/uriah-dev/elysia-kit-min.git";
  const repoName = isAdvanced ? "elysia-kit" : "elysia-kit-min";
  const cloneOpts = { old: `./${repoName}`, newPath: `./${name}` };

  console.log(`🚀 Cloning ${repoName} scaffold...`);
  const { success, error } = await command("git", ["clone", repoUrl]);
  if (!success) {
    console.log(error);
    return;
  }
  console.log("✅ Scaffold cloned successfully");

  await renameFolder(name, cloneOpts);
  await removeGitDir(cloneOpts.newPath);

  if (isAdvanced) {
    const excludedDeployments = promptDeploymentOptions();
    await runDeploymentCleanup(cloneOpts.newPath, excludedDeployments);
  }

  console.log(`\n🎉 Project "${name}" is ready!`);
  console.log(`\nNext steps:`);
  console.log(`  cd ${name}`);
  console.log(`  cp .env.example .env`);
  console.log(`  bun install`);
  console.log(`  bun run dev`);
});
