import { command, createCommand, getCommandValue } from "@utils/index.ts";
import {
  buildPhoenixArgs,
  checkMixInstalled,
  displayPhoenixSummary,
  getMixVersion,
  promptPhoenixOptions,
  promptValidElixirName,
  showElixirInstallInstructions,
} from "../sub-core/index.ts";

export const scaffold = createCommand(async (args, cmd) => {
  const values = getCommandValue(args, cmd);
  const rawName = values[0] || (prompt("Enter project name: \n> ") as string);

  const name = promptValidElixirName(rawName);

  console.log("🔍 Checking for Elixir/Mix...");
  const mixInstalled = await checkMixInstalled();

  if (!mixInstalled) {
    showElixirInstallInstructions();
    return;
  }

  const version = await getMixVersion();
  console.log(`✓ Mix found: ${version}`);

  const options = promptPhoenixOptions();
  displayPhoenixSummary(options);

  const phoenixArgs = buildPhoenixArgs(name, options);

  console.log("🚀 Creating Phoenix app...\n");
  console.log(`   mix ${phoenixArgs.join(" ")}\n`);

  const { success, output, error } = await command("mix", phoenixArgs);

  if (success) {
    console.log(output);
    console.log(`\n🎉 Project "${name}" is ready!`);
    console.log(`\nNext steps:`);
    console.log(`  cd ${name}`);
    console.log(`  mix setup`);
    console.log(`  mix phx.server`);
  } else {
    console.log("❌ Failed to create project:");
    console.log(error);
  }
});
