import { Args, fig, parse } from "@deps";
import { alias, commands } from "@utils/commands.ts";

export function parseArguments(args: string[]): Args {
  const booleanArgs = ["help"];
  const stringArgs = ["length", ...commands.map((c) => (c.name))];

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
  console.log(
    `
    \nUsage: Below are available commands
    \n
    ---------------------------------------------------------
      create          <=>    Generate new project scaffold
    ---------------------------------------------------------
      secret          <=>    Generate random secret token
    ---------------------------------------------------------


    \nOptional flags:
    ---------------------------------------------------------
      -h, --help         <=>    Display help and exit
    ---------------------------------------------------------
      -l, --length       <=>    State secret length
    ---------------------------------------------------------
  `.trim(),
  );

  Deno.exit(0);
}

export async function printHello() {
  const word = await fig("GERD!");
  console.log(`
    \nWelcome to
    \n${word}
  `);
}
