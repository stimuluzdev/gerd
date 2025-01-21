import type { Command } from "@utils/commands.ts";
import { scaffold } from "./call/index.ts";

const Call = { create: scaffold };

const SubCalls: Command[] = [{
  name: "create",
  call: scaffold,
}];

export { Call, SubCalls };
