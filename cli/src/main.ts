import { parseArguments, printHello, printHelp } from "@utils/parse.ts";
import { checkCmd } from "@utils/index.ts";
import { commands } from "@utils/commands.ts";

async function main(inputArgs: string[]) {
  const args = parseArguments(inputArgs);
  const cmds = args._;

  if (args.help) {
    await printHelp();
  }

  for (const { name, call } of commands) {
    const cmd = checkCmd(cmds, name);
    if (cmd) {
      await call(args);
    }
  }

  await printHello();
}

await main(Deno.args);
