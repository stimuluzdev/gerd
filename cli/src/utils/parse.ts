import { type Args, fig, parse } from "@deps";
import { commands } from "@utils/commands.ts";
import { helpMessage } from "@utils/common/help.ts";
import { getAliasValue, getAllFrameworks } from "@utils/index.ts";
import config from "../../deno.json" with { type: "json" };

export async function parseArguments(args: string[]): Promise<Args> {
  const frameworks = await getAllFrameworks();
  const boolArgs = commands.filter((c) => c.alias === true);
  const strArgs = commands.filter((c) => !c.alias).map((c) => (c.name));

  const booleanArgs = [
    "help",
    "version",
    ...boolArgs.map((
      c,
    ) => (c.name)),
  ];
  const stringArgs = ["length", ...strArgs, ...frameworks];
  // deno-lint-ignore no-explicit-any
  const alias: any = {
    help: "h",
    version: "v",
    length: "l",
  };

  for (const arg of boolArgs) {
    if (arg.aliasValue && arg.aliasValue.length > 1) {
      throw new Error("aliasValue should be a single char");
    }
    alias[arg.name] = getAliasValue(arg);
  }

  return parse(args, {
    alias,
    boolean: booleanArgs,
    string: stringArgs,
    stopEarly: false,
    "--": true,
    default: { length: "25" },
  });
}

export async function printHelp() {
  await printHello();
  console.log(helpMessage);
  Deno.exit();
}

export function printVersion() {
  console.log(`gerd v${config.version}`);
  Deno.exit();
}

export async function printHello() {
  const word = await fig("GERD!");
  console.log(`
    \nWelcome to
    \n${word}
  `);
}
