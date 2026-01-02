import { command, createCommand, getCommandValue } from "@utils/index.ts";
import {
  buildBunArgs,
  buildViteArgs,
  displayReactSummary,
  getNextSteps,
  promptReactOptions,
} from "../sub-core/index.ts";

export const scaffold = createCommand(async (args, cmd) => {
  const values = getCommandValue(args, cmd);
  const name = values[0] || (prompt("Enter project name: \n> ") as string);

  // Prompt user for React options
  const options = promptReactOptions();
  displayReactSummary(options);

  console.log("🚀 Creating React app...\n");

  let success: boolean;
  let output: string;
  let error: string | undefined;

  if (options.bundler === "bun") {
    // Use Bun
    const bunArgs = buildBunArgs(name);
    const result = await command("bun", bunArgs);
    success = result.success;
    output = result.output;
    error = result.error;
  } else {
    // Use Vite
    const { cmd: viteCmd, args: viteArgs } = buildViteArgs(name, options);
    const result = await command(viteCmd, viteArgs);
    success = result.success;
    output = result.output;
    error = result.error;
  }

  if (success) {
    console.log(output);
    console.log(`\n🎉 Project "${name}" is ready!`);
    console.log(`\nNext steps:`);
    const steps = getNextSteps(name, options);
    steps.forEach((step) => console.log(`  ${step}`));
  } else {
    console.log("❌ Failed to create project:");
    console.log(error);
  }
});
