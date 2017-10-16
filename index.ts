import { mkdirSync, appendFileSync, writeFileSync, readdirSync, rename, statSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import { cwd } from "process";
import * as website from "./website.json";

function getIndexTemplate(data) {
  const templatePath = join(cwd(), "template.html");
  const templateExists = existsSync(templatePath);
  if (!templateExists) throw Error("no template file");
  let template = readFileSync(templatePath).toString();
  for (let opt in data) {
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
  }, [])
}


function createWebsite(fileName) {
  const template = getIndexTemplate(website);
  const fileContent = getAllFileContent();
  const filePath = `.public/${fileName}.html`;
  writeFileSync(filePath, template[0]);
  fileContent.forEach(line => {
    appendFileSync(filePath, `<p>${line}</p>`);
  });
  appendFileSync(filePath, template[1]);
}

createWebsite("index");

