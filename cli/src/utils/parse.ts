import { Args, fig, parse } from "@deps";
import { commands } from "@utils/commands.ts";
import { helpMessage } from "@utils/common/help.ts";
import { getAllFrameworks } from "@utils/index.ts";

export async function parseArguments(args: string[]): Promise<Args> {
  const frameworks = await getAllFrameworks();
  const boolArgs = commands.filter((c) => c.alias === true);
  const strArgs = commands.filter((c) => !c.alias).map((c) => (c.name));

  const booleanArgs = [
    "help",
    ...boolArgs.map((
      c,
    ) => (c.name)),
  ];
  const stringArgs = ["length", ...strArgs, ...frameworks];
  // deno-lint-ignore no-explicit-any
  const alias: any = {
    help: "h",
    length: "l",
  };

  for (const arg of boolArgs) {
    if (arg.aliasValue && arg.aliasValue.length > 1) {
      throw new Error("aliasValue should be a single char");
    }
    alias[arg.name] = arg.aliasValue || arg.name.charAt(0).toLowerCase();
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
  Deno.exit(0);
}

export async function printHello() {
  const word = await fig("GERD!");
  console.log(`
    \nWelcome to
    \n${word}
  `);
}
