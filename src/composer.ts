import { execSync } from 'child_process';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'fs';
import { join } from 'path';
import { argv, cwd } from 'process';
import { getConfigFile } from './config';
import { renderTemplate } from './templater';
import { createParser } from './parser-factory';

function getFileContent(files, inputFormat) {
  const existingFiles = files.filter(file => existsSync(file));
  const parser = createParser(inputFormat);
  return existingFiles.map(file => {
    console.log(`Parsing ${file}`);
    return parser.parse(file);
  });
}

function getFSDate(filePath) {
  return statSync(filePath).mtime.getTime();
}

function getGitDate(filePath) {
  const gitDate = execSync(`git log -1 --format="%at" -- ${filePath}`);
  return parseInt(gitDate.toString(), 10);
}

function getSortedFiles(inputDir, inputType) {
  const textFiles = readdirSync(join(cwd(), inputDir));
  const foundFiles = textFiles.map(file => {
    return {
      name: file,
      time:
        inputType === 'git'
          ? getGitDate(join(inputDir, file))
          : getFSDate(join(cwd(), inputDir, file)),
    };
  });
  return foundFiles
    .sort((file1, file2) => file2.time - file1.time)
    .map(file => join(cwd(), inputDir, file.name));
}

function createOutputFile(outputDir, filename) {
  if (!existsSync(join(cwd(), outputDir))) {
    mkdirSync(join(cwd(), outputDir));
  }
  return join(outputDir, `${filename}`);
}

export default function createWebsite() {
  const conf = getConfigFile(argv);
  const OutputFile = createOutputFile(conf.output, conf.filename);
  const sortedFiles = getSortedFiles(conf.input, conf.inputSort);
  const posts = getFileContent(sortedFiles, conf.inputFormat);
  const template = renderTemplate(posts, conf);
  writeFileSync(OutputFile, template);
  console.log(`Output blankpage to ${OutputFile}`);
}
