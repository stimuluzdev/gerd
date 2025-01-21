import { parseArguments, printHello, printHelp } from "@utils/parse.ts";
import { checkCmd } from "@utils/index.ts";
import { commands } from "@utils/commands.ts";

async function main(inputArgs: string[]) {
  const args = parseArguments(inputArgs);
  console.log(args);
  if (args.help) {
    await printHelp();
  }

  for (const { name, call } of commands) {
    const cmd = checkCmd(args, name);
    if (cmd) {
      await call(args, name);
    }
  }

  await printHello();
}

await main(Deno.args);
