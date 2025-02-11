import { command, createCommand, getCommandValue } from "@utils/index.ts";

export const scaffold = createCommand(async (args, cmd) => {
  const values = getCommandValue(args, cmd);
  const name = values[0] || (prompt("Enter project name: \n> ") as string);
  const output = await command("pnpm", ["create", "t3-app@latest", name, "-y"]);
  console.log(output);

  Deno.exit(0);
});
