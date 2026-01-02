import { command, createCommand, getCommandValue } from "@utils/index.ts";
import {
  buildT3Args,
  displayT3Summary,
  promptT3Options,
} from "../sub-core/index.ts";

export const scaffold = createCommand(async (args, cmd) => {
  const values = getCommandValue(args, cmd);
  const name = values[0] || (prompt("Enter project name: \n> ") as string);

  const options = promptT3Options();
  displayT3Summary(options);

  const t3Args = buildT3Args(name, options);

  console.log("🚀 Creating T3 app...\n");
  const { success, output, error } = await command("pnpm", t3Args);

  if (success) {
    console.log(output);
    console.log(`\n🎉 Project "${name}" is ready!`);
    console.log(`\nNext steps:`);
    console.log(`  cd ${name}`);
    console.log(`  pnpm install`);
    console.log(`  pnpm dev`);
  } else {
    console.log("❌ Failed to create project:");
    console.log(error);
  }
});
