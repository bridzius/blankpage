import { execSync } from "child_process";
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "fs";
import { extname, join } from "path";
import { argv, cwd } from "process";
import Config from "./config";

function getConfigFile(args) {
  const simplifiedArgs: string[] = args.slice(2);
  if (
    typeof simplifiedArgs[0] === "string" &&
    extname(simplifiedArgs[0]) === ".json" &&
    existsSync(simplifiedArgs[0])
  ) {
    return simplifiedArgs[0];
  } else {
    throw Error("No input file specified");
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
  return fileExists
    ? readFileSync(filePath)
        .toString()
        .split("\n")
    : "";
}

function getFSDate(filePath) {
  return statSync(filePath).mtime.getTime();
}

function getGitDate(filePath) {
  const gitDate = execSync(`git log -1 --format="%at" -- ${filePath}`);
  return parseInt(gitDate.toString(), 10);
}

function getAllFileContent(inputDir, inputType) {
  const textFiles = readdirSync(join(cwd(), inputDir));
  const parsedFiles = textFiles.map((file) => {
    return {
      name: file,
      time:
        inputType === "git"
          ? getGitDate(join(inputDir, file))
          : getFSDate(join(cwd(), inputDir, file)),
    };
  });
  const sortedFiles = parsedFiles
    .sort((file1, file2) => file2.time - file1.time)
    .map((file) => file.name);
  return sortedFiles.reduce((output, file) => {
    return output.concat(getFileContent(join(cwd(), inputDir, file)));
  }, []);
}

function createOutputFile(outputDir, filename) {
  if (!existsSync(join(cwd(), outputDir))) {
    mkdirSync(join(cwd(), outputDir));
  }
  return join(outputDir, `${filename}`);
}

export default function createWebsite() {
  const configFile = getConfigFile(argv);
  const Configuration = new Config(configFile);
  const OutputFile = createOutputFile(
    Configuration.output,
    Configuration.filename,
  );
  const template = getIndexTemplate(Configuration);
  const fileContent = getAllFileContent(
    Configuration.input,
    Configuration.inputType,
  );
  writeFileSync(OutputFile, template[0]);
  fileContent.forEach((line) => {
    if (line !== "") {
      appendFileSync(OutputFile, `<p>${line}</p>\n`);
    }
  });
  console.log(`Generating blankpage to ${OutputFile}`);
  appendFileSync(OutputFile, template[1]);
}
