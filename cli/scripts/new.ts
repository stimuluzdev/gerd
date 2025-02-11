import { Prompt } from "@deps";
import {
  capFirstChar,
  getAllFrameworks,
  getSubfolders,
  writeFile,
} from "@utils/index.ts";

const newLang = "New Language";
const languages = await getSubfolders("./src/languages");
languages.push(newLang);

let language = await Prompt.Select.prompt({
  message: "Select language:",
  options: languages.map((lang) => ({
    name: capFirstChar(lang),
    value: lang,
  })),
  search: true,
});

if (language === newLang) {
  const lang = prompt("Enter new language")?.toLowerCase();
  const exist = languages.find((l) => l.toLowerCase() === lang);
  if (exist !== undefined) {
    console.log("Language already added!");
    Deno.exit(0);
  }
  language = lang!;
}

const frameworks = await getAllFrameworks();
const framework = prompt("Enter name of new framework?")?.toLowerCase();
const exist = frameworks.find((f) => f.toLowerCase() === framework);
if (exist !== undefined) {
  console.log("Framework already added!");
  Deno.exit(0);
}

const path = `./src/languages/${language}/${framework}`;
try {
  await Deno.mkdir(`./src/languages/${language}`);
} catch {
  console.log("");
}

await Deno.mkdir(path);
await Deno.mkdir(`${path}/core`);
await Deno.mkdir(`${path}/docs`);
await Deno.mkdir(`${path}/sub-core`);

await writeFile(
  `${path}/core/index.ts`,
  `
import {
  command,
  createCommand,
  getCommandValue,
  renameFolder,
} from "@utils/index.ts";

export const scaffold = createCommand(async (args, cmd) => {
  const values = getCommandValue(args, cmd);
  console.log({values, args});

  Deno.exit(0);
});
`.trim()
);

await writeFile(
  `${path}/docs/index.mdx`,
  `
---
title: ${capFirstChar(framework!)}
description: Docs on how ${framework} commands work
---

Additional docs goes here!
`.trim()
);

await writeFile(
  `${path}/sub-core/index.ts`,
  `
// Write additional function here and import into the SubCore in ../index.ts
`.trim()
);

await writeFile(
  `${path}/index.ts`,
  `
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
`.trim()
);
