import { commands } from "@utils/commands.ts";
import { getAliasValue } from "@utils/index.ts";

const alias = commands.filter((c) => c.alias === true);

export const helpMessage = `
    \nUsage: Below are available commands
    \n
    ${
  commands.map((c, i) => `
    ${
    i === 0 ? "---------------------------------------------------------" : ""
  }
      ${c.name} <=>    ${c.desc || ""}
    ---------------------------------------------------------`).join("").trim()
}


    \nOptional flags:
    ---------------------------------------------------------
    -h, --help    <=>  Display help and exit
    ---------------------------------------------------------
    -l, --length  <=>  State secret length
    ---------------------------------------------------------
    ${
  alias.map((a) => `
      -${getAliasValue(a)}, --create  <=>  Alias to ${a.name}
    ---------------------------------------------------------`).join("").trim()
}

  `.trim();
