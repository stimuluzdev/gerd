import { parseArguments, printHello, printHelp } from "@utils/parse.ts";
import { capFirstChar, checkCmd, getSubfolders } from "@utils/index.ts";
import { Prompt } from "@deps";

async function main(inputArgs: string[]) {
  const args = parseArguments(inputArgs);
  if (args.help) {
    await printHelp();
  }

  const cmds = args._;
  const create = checkCmd(cmds, "create");
  if (create) {
    const languages = await getSubfolders("./src/languages");
    const language = await Prompt.Select.prompt({
      message:
        "Select language (use 'space' to select and 'Enter' to confirm):",
      options: languages.map((lang) => ({
        name: capFirstChar(lang),
        value: lang,
      })),
      search: true,
    });

    const frameworks = await getSubfolders(`./src/languages/${language}`);
    const framework = await Prompt.Select.prompt({
      message:
        "Select framework (use 'space' to select and 'Enter' to confirm):",
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
    await Call.generateScaffold(args);
  }

  //   const secret = checkCmd(cmds, "secret");
  //   if (secret) {
  //     await Call.generateSecret(args);
  //   }

  //   const isNew = checkCmd(cmds, "new");
  //   if (isNew) {
  //     await Call.generateScaffold(args);
  //   }

  //   const add = checkCmd(cmds, "add");
  //   if (add) {
  //     await generateRoute(args);
  //   }

  await printHello();
}

await main(Deno.args);
