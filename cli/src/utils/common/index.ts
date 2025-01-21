import {
  capFirstChar,
  command,
  getCommandValue,
  getSubfolders,
} from "@utils/index.ts";
import { Prompt } from "@deps";
import { type FunctionType } from "@utils/commands.ts";

export const generateSecret = async (args: {
  // deno-lint-ignore no-explicit-any
  [x: string]: any;
  _: Array<string | number>;
}, _cmd: string) => {
  const num = args["length"] || args["l"];
  const output = await command("openssl", ["version", "-d"]);
  if (output.includes("OPENSSLDIR")) {
    const output = await command("openssl", ["rand", "-base64", num]);
    console.log(output);
  }
  Deno.exit(0);
};

export const runCreate = async (args: {
  // deno-lint-ignore no-explicit-any
  [x: string]: any;
  _: Array<string | number>;
}, cmd: string) => {
  const value = getCommandValue(args, cmd);
  const languages = await getSubfolders("./src/languages");
  let language = null;
  let framework = null;
  if (value.length > 0) {
    const [name] = value;

    for (const lang of languages) {
      const frameworks = await getSubfolders(`./src/languages/${lang}`);
      const frame = frameworks.find((f) => f === name.toLowerCase());
      if (frame !== undefined) {
        language = lang;
        framework = frame;
        break;
      }
    }
    if (!language || !framework) {
      console.log("Please enter valid framework name!");
      Deno.exit(0);
    }
  } else {
    language = await Prompt.Select.prompt({
      message: "Select language:",
      options: languages.map((lang) => ({
        name: capFirstChar(lang),
        value: lang,
      })),
      search: true,
    });
    const frameworks = await getSubfolders(`./src/languages/${language}`);
    framework = await Prompt.Select.prompt({
      message: "Select framework:",
      options: frameworks.map((name) => ({
        name: capFirstChar(name),
        value: name,
      })),
      search: true,
    });
  }

  const Call = await import(
    `@src/languages/${language}/${framework}/index.ts`
  ).then(
    (m) => m.Call,
  ) as { create: FunctionType };
  await Call.create(args, cmd);
};
