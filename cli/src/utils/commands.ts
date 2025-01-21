import { generateSecret, runCreate } from "@utils/common/index.ts";

interface Command {
  name: string;
  //deno-lint-ignore ban-types
  call: Function;
  alias?: boolean;
  aliasValue?: string;
}

/* NB:
 - aliasValue should always be a single char, defaults to first char of command name
*/

export const commands: Command[] = [
  { name: "create", call: runCreate, alias: true },
  { name: "secret", call: generateSecret },
];
