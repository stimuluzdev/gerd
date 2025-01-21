import { parseArguments, printHello, printHelp } from "@utils/parse.ts";
import { checkCmd, registerCommands } from "@utils/index.ts";
import { commands, frameworks } from "@utils/commands.ts";

async function main(inputArgs: string[]) {
  const args = await parseArguments(inputArgs);
  if (args.help) {
    await printHelp();
  }

  await registerCommands(commands, args);

  for (const { framework, subCommands } of frameworks) {
    const cmd = checkCmd(args, framework);
    if (cmd) {
      await registerCommands(subCommands, args);
    }
  }

  await printHello();
}

await main(Deno.args);
