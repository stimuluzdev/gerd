import fs from "fs";

const EXTENSION = ".mdx";

const getFiles = (dir: string, files: string[] = []) => {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else {
      if (name.includes(EXTENSION)) {
        files.push(name);
      }
    }
  }
  return files;
};

const delFiles = (dir: string, match: string) => {
  const fileList = fs.readdirSync(dir);
  for (const name of fileList) {
    if (name.includes(match)) {
      fs.unlinkSync(`${dir}/${name}`);
    }
  }
};

const main = () => {
  const path = "../cli/src/languages";
  const contentPath = "./content/docs";

  const docs = getFiles(path);
  const frameworks: string[] = [];

  for (const doc of docs) {
    const framework = doc.split("/")[5];
    delFiles(contentPath, framework);
  }

  for (const doc of docs) {
    const framework = doc.split("/")[5];
    const appearance = frameworks.filter((f) => f === framework).length;
    const name = `${contentPath}/${framework}_${appearance}${EXTENSION}`;
    fs.copyFileSync(doc, name);
    frameworks.push(framework);
  }
};

main();
