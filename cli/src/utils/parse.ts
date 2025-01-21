import { Args, fig, parse } from "@deps";

export function parseArguments(args: string[]): Args {
  const booleanArgs = ["help", "secret"];
  const stringArgs = ["length"];

  const alias = {
    help: "h",
    length: "l",
  };

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
    Welcome to
    ${word}
  `);
}
