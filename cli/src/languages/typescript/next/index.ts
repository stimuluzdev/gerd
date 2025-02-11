import type { Command, CoreType } from "@utils/commands.ts";
import { scaffold } from "./core/index.ts";

const Core = { create: scaffold } as CoreType;

const SubCore: Command[] = [
  {
    name: "create",
    call: scaffold,
  },
];

export { Core, SubCore };