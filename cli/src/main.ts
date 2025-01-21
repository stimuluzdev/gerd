import { parseArguments, printHello, printHelp } from "@utils/parse.ts";
import { checkCmd } from "@utils/index.ts";
import { generateSecret, runCreate } from "@src/common/index.ts";

async function main(inputArgs: string[]) {
  const args = parseArguments(inputArgs);
  if (args.help) {
    await printHelp();
  }

  const cmds = args._;
  const create = checkCmd(cmds, "create");
  if (create) {
    await runCreate(args);
  }

    const secret = checkCmd(cmds, "secret");
    if (secret) {
      await generateSecret(args);
    }

  await printHello();
}

await main(Deno.args);
