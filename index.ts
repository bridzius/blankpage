import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rename, statSync, writeFileSync } from "fs";
import { extname, join } from "path";
import { argv, cwd } from "process";

function getWebsiteConfig(args) {
  const simplifiedArgs = args.slice(2);
  if (extname(simplifiedArgs[0]) === ".json" && existsSync(simplifiedArgs[0])) {
    return JSON.parse(readFileSync(simplifiedArgs[0]).toString());
  } else {
    throw Error("No website.json specified");
  }
}

function getIndexTemplate(data) {
  const templatePath = join(cwd(), "template.html");
  const templateExists = existsSync(templatePath);
  if (!templateExists) {
    throw Error("no template file");
  }
  let template = readFileSync(templatePath).toString();
  for (const opt of Object.keys(data)) {
    template = template.replace(`<//${opt.toUpperCase()}//>`, data[opt]);
  }
  return template.split("<//CONTENT//>");
}

function getFileContent(filePath) {
  const fileExists = existsSync(filePath);
  return fileExists ? readFileSync(filePath).toString().split("\n") : "";
}

function getAllFileContent() {
  const textFiles = readdirSync(join(cwd(), "text"));
  return textFiles.reduce((output, file) => {
    return output.concat(getFileContent(join(cwd(), "text", file)));
  }, []);
}

function createWebsite(fileName) {
  const websiteConfig = getWebsiteConfig(argv);
  const template = getIndexTemplate(websiteConfig);
  const fileContent = getAllFileContent();
  const filePath = `.public/${fileName}.html`;
  writeFileSync(filePath, template[0]);
  fileContent.forEach((line) => {
    appendFileSync(filePath, `<p>${line}</p>`);
  });
  appendFileSync(filePath, template[1]);
}

createWebsite("index");
