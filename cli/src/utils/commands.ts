import { generateSecret, runCreate } from "@utils/common/index.ts";
import { getAllFrameworksWithLang, getSubCommands } from "@utils/index.ts";

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

const allFrameworks = await getAllFrameworksWithLang();
const subCommands = await getSubCommands(allFrameworks);
export const frameworks: FrameworkCommand[] = subCommands.map((f) => {
  return ({ framework: f.framework, subCommands: f.subCommands });
});
