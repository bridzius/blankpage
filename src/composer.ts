import { execSync } from "child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync
} from "fs";
import { join } from "path";
import { argv, cwd } from "process";
import { getConfigFile } from "./config";
import { renderTemplate } from "./templater";
import { createParser } from "./parser-factory";
import { InputSorts, ParserTypes } from "./types";

const parseFileContent = (
  files: string[],
  inputFormat: ParserTypes
): string[] => {
  const existingFiles = files.filter(file => existsSync(file));
  const parser = createParser(inputFormat);
  return existingFiles.map(file => {
    console.log(`Parsing ${file}`);
    return parser.parse(file);
  });
};

const getFSDate = (filePath: string): number => {
  return Math.floor(statSync(filePath).mtime.getTime() / 1000);
};

const getGitDate = (filePath: string) => {
  const gitDate = execSync(`git log -1 --format="%at" -- ${filePath}`);
  let date = parseInt(gitDate.toString(), 10);
  if (isNaN(date)) {
    console.log(
      `No git date found for ${filePath} - checking filesystem creation time`
    );
    date = getFSDate(join(cwd(), filePath));
  }
  return date;
};

const getSortedFiles = (inputDir: string, inputType: InputSorts) => {
  const textFiles = readdirSync(join(cwd(), inputDir));
  const foundFiles = textFiles.map(file => {
    return {
      name: file,
      time:
        inputType === InputSorts.Git
          ? getGitDate(join(inputDir, file))
          : getFSDate(join(cwd(), inputDir, file))
    };
  });
  return foundFiles
    .sort((file1, file2) => file2.time - file1.time)
    .map(file => join(cwd(), inputDir, file.name));
};

const createOutputFile = (outputDir: string, filename: string) => {
  if (!existsSync(join(cwd(), outputDir))) {
    mkdirSync(join(cwd(), outputDir));
  }
  return join(outputDir, `${filename}`);
};

export const createWebsite = () => {
  const conf = getConfigFile(argv);
  const outputFile = createOutputFile(conf.output, conf.filename);
  const sortedFiles = getSortedFiles(conf.input, conf.inputSort);
  const posts = parseFileContent(sortedFiles, conf.inputFormat);
  const template = renderTemplate(posts, conf);
  writeFileSync(outputFile, template);
  console.log(`Output blankpage to ${outputFile}`);
};
