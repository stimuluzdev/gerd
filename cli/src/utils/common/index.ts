import { capFirstChar, command, getSubfolders } from "@utils/index.ts";
import { Prompt } from "@deps";

export const generateSecret = async (args: {
  // deno-lint-ignore no-explicit-any
  [x: string]: any;
  _: Array<string | number>;
}) => {
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
}) => {
  const languages = await getSubfolders("./src/languages");
  const language = await Prompt.Select.prompt({
    message: "Select language:",
    options: languages.map((lang) => ({
      name: capFirstChar(lang),
      value: lang,
    })),
    search: true,
  });

  const frameworks = await getSubfolders(`./src/languages/${language}`);
  const framework = await Prompt.Select.prompt({
    message: "Select framework:",
    options: frameworks.map((name) => ({
      name: capFirstChar(name),
      value: name,
    })),
    search: true,
  });
  const Call = await import(
    `@src/languages/${language}/${framework}/index.ts`
  ).then(
    (m) => m.Call,
  );
  await Call.scaffold(args);
};
