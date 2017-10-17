#!/usr/bin/env node

import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rename,
  statSync,
  writeFileSync,
} from "fs";
import {
  extname,
  join,
} from "path";
import {
  argv,
  cwd,
} from "process";

function getConfig(args) {
  const simplifiedArgs: string[] = args.slice(2);
  if (typeof simplifiedArgs[0] === "string" &&
    extname(simplifiedArgs[0]) === ".json" &&
    existsSync(simplifiedArgs[0])) {
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

function getAllFileContent(inputDir) {
  const textFiles = readdirSync(join(cwd(), inputDir));
  return textFiles.reduce((output, file) => {
    return output.concat(getFileContent(join(cwd(), inputDir, file)));
  }, []);
}

function verifyConfig(config) {
  if (isUndefined(config, "input")) {
    throw Error("No input defined in website.json (input: 'dir where text files are')");
  }
  if (isUndefined(config, "output")) {
    throw Error("No output defined in website.json (output: 'outputDir')");
  }
}

function createOutputFile(outputDir, filename = "index") {
  if (!existsSync(join(cwd(), outputDir))) {
    mkdirSync(join(cwd(), outputDir));
  }
  return join(outputDir, `${filename}.html`);
}

function isUndefined(object: object, property: string) {
  return !object.hasOwnProperty(property);
}

function createWebsite() {
  const Config = getConfig(argv);
  verifyConfig(Config);
  const OutputFile = createOutputFile(Config.output, Config.filename);
  const template = getIndexTemplate(Config);
  const fileContent = getAllFileContent(Config.input);
  writeFileSync(OutputFile, template[0]);
  fileContent.forEach((line) => {
    appendFileSync(OutputFile, `<p>${line}</p>`);
  });
  appendFileSync(OutputFile, template[1]);
}

createWebsite();
