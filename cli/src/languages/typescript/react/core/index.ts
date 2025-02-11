import { command, createCommand, getCommandValue } from "@utils/index.ts";

export const scaffold = createCommand(async (args, cmd) => {
  const values = getCommandValue(args, cmd);
  console.log({ values, args });
  await command("", []);
  Deno.exit(0);
});
