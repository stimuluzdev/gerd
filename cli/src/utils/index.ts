import { Path, readline } from "@deps";

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

export const checkCmd = (cmds: (string | number)[], cmd: string) => {
  const find = cmds.find((c) => c === cmd);
  return find !== undefined;
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
