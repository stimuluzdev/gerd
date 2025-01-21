import { generateSecret, runCreate } from "@utils/common/index.ts";
import { scaffold } from "@src/languages/typescript/hono/call/index.ts";

export type ArgsType = {
  // deno-lint-ignore no-explicit-any
  [x: string]: any;
  _: Array<string | number>;
};
export type FunctionType = (args: ArgsType, cmd: string) => Promise<void>;

export interface Command {
  name: string;
  call: FunctionType;
  alias?: boolean;
  aliasValue?: string;
}

interface FrameworkCommand {
  framework: string;
  subCommands: Command[];
}

/* NB:
 - aliasValue should always be a single char, defaults to first char of command name
*/

export const commands: Command[] = [
  { name: "create", call: runCreate, alias: true },
  { name: "secret", call: generateSecret },
];

export const frameworks: FrameworkCommand[] = [
  {
    framework: "hono",
    subCommands: [{
      name: "create",
      call: scaffold,
    }],
  },
];
