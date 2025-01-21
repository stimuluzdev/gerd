import { generateSecret, runCreate } from "@utils/common/index.ts";

export type ArgsType = {
  // deno-lint-ignore no-explicit-any
  [x: string]: any;
  _: Array<string | number>;
};
export type FunctionType = (args: ArgsType, cmd: string) => Promise<void>;

interface Command {
  name: string;
  call: FunctionType;
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
