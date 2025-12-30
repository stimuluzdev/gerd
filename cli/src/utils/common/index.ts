import {
  capFirstChar,
  command,
  getCommandValue,
  getSubfolders,
} from "@utils/index.ts";
import { Prompt } from "@deps";
import type { ArgsType, CoreType } from "@utils/commands.ts";

export const generateSecret = async (args: ArgsType, _cmd: string) => {
  const num = args["length"] || args["l"];
  const result = await command("openssl", ["version", "-d"]);
  if (result.success && result.output.includes("OPENSSLDIR")) {
    const { success, output } = await command("openssl", [
      "rand",
      "-base64",
      num,
    ]);
    if (success) {
      console.log(output);
    }
  }
};

export const runCreate = async (args: ArgsType, cmd: string) => {
  const value = getCommandValue(args, cmd);
  const languages = await getSubfolders("../languages");
  let language = null;
  let framework = null;
  if (value.length > 0) {
    const [name] = value;

    for (const lang of languages) {
      const frameworks = await getSubfolders(`../languages/${lang}`);
      const frame = frameworks.find((f) => f === name.toLowerCase());
      if (frame !== undefined) {
        language = lang;
        framework = frame;
        break;
      }
    }
    if (!language || !framework) {
      console.log("Please enter valid framework name!");
      return;
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
    const frameworks = await getSubfolders(`../languages/${language}`);
    framework = await Prompt.Select.prompt({
      message: "Select framework:",
      options: frameworks.map((name) => ({
        name: capFirstChar(name),
        value: name,
      })),
      search: true,
    });
  }

  const Core = (await import(
    `@src/languages/${language}/${framework}/index.ts`
  ).then((m) => m.Core)) as CoreType;

  await Core.create(args, cmd);
};
