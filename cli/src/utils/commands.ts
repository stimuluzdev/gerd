import { generateSecret, runCreate } from "@utils/common/index.ts";

export const commands = [
  {name: "create", call: runCreate},
  {name: "secret", call: generateSecret},
];
