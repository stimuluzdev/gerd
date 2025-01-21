import { Path, readline } from "@deps";
import type { ArgsType, Command } from "@utils/commands.ts";

export type FrameworkWithLang = { lang: string; framework: string };
export const command = async (cmd: string, args: string[]) => {
  const td = new TextDecoder();
  const { success, stdout } = await new Deno.Command(cmd, {
    args,
  }).output();
  if (success) {
    return td.decode(stdout).trim();
  }
  return "";
};

export const checkCmd = (args: ArgsType, cmd: string) => {
  const find = args._?.find((c) => c === cmd);
  const alias = Object.keys(args).find((k) => k === cmd);
  if (alias !== undefined) {
    const val = args[alias];
    if (val === true || val.length > 0) {
      return true;
    }
  }
  return find !== undefined;
};

export const getCommandValue = (args: ArgsType, cmd: string) => {
  const alias = Object.keys(args).find((k) => k === cmd);
  if (alias !== undefined) {
    const val = args[alias];
    if (typeof val === "boolean") {
      return args._.filter((c) => c !== cmd.toLowerCase());
    }
    return [val];
  }
  return [];
};

export const renameFolder = async (
  name: string,
  info: { old: string; newPath: string },
) => {
  const { old, newPath } = info;
  await Deno.rename(old, newPath);
  const path = `${newPath}/package.json`;
  await rewriteFile(path, { old: "hono-scaffold", write: name });
};

export const rewriteFile = async (path: string, content: {
  old: string;
  write: string;
}) => {
  const text = await readFile(path);
  const data = text.replace(content.old, content.write);
  await Deno.remove(path);
  await writeFile(path, data);
};

const readFile = async (path: string) => {
  const text = await Deno.readTextFile(path);
  return text;
};

export const writeFile = async (path: string, data: string) => {
  await Deno.writeTextFile(path, data);
};

export const getRootName = (newPath = "") => {
  const [path] = Path.dirname(Path.fromFileUrl(import.meta.url)).split("/src");
  return path + newPath;
};

export const readFileAsArray = async (path: string) => {
  const file = await Deno.open(path);
  const lines: string[] = [];
  console.log({ read: readline(file) });
  for await (const line of readline(file)) {
    console.log(new TextDecoder().decode(line));
  }
  file.close();
  return { lines };
};

export const capFirstChar = (str: string) => {
  if (!str || typeof str !== "string") {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
};

export async function getSubfolders(folderPath: string): Promise<string[]> {
  const subfolders: string[] = [];
  for await (const entry of Deno.readDir(folderPath)) {
    if (entry.isDirectory) {
      subfolders.push(entry.name);
    }
  }
  return subfolders;
}

export const getAllFrameworks = async () => {
  const frameworks: string[] = [];
  const languages = await getSubfolders("./src/languages");
  for (const lang of languages) {
    const names = await getSubfolders(`./src/languages/${lang}`);
    frameworks.push(...names);
  }
  return frameworks;
};

export const getAllFrameworksWithLang = async () => {
  const frameworks: FrameworkWithLang[] = [];
  const languages = await getSubfolders("./src/languages");
  for (const lang of languages) {
    const names = await getSubfolders(`./src/languages/${lang}`);
    frameworks.push(...names.map((n) => ({ lang, framework: n })));
  }
  return frameworks;
};

export const registerCommands = async (commands: Command[], args: ArgsType) => {
  for (const { name, call } of commands) {
    const cmd = checkCmd(args, name);
    if (cmd) {
      await call(args, name);
    }
  }
};

export const getSubCommands = async (frameworks: FrameworkWithLang[]) => {
  const subCommands: { framework: string; subCommands: Command[] }[] = [];
  for (const f of frameworks) {
    const SubCommands = await import(
      `@src/languages/${f.lang}/${f.framework}/index.ts`
    ).then(
      (m) => m.SubCalls,
    ) as Command[];
    subCommands.push({ framework: f.framework, subCommands: SubCommands });
  }
  return subCommands;
};

export const getAliasValue = (alias: Command) => alias.aliasValue || alias.name.charAt(0).toLowerCase()
