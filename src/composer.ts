import { execSync } from "child_process";
import {
    existsSync,
    mkdirSync,
    readdirSync,
    statSync,
    writeFileSync,
    readFileSync,
} from "fs";
import { join } from "path";
import { argv, cwd } from "process";
import { getConfigFile, IBlankConfig } from "./config";
import { Parser, ParserOptions } from "./parsers/parser";
import { createParser } from "./parsers/parser-factory";
import { InputSorts, TimedFile } from "./types";
import { Post, PostConfig } from './posts/post';
import { sortCompare } from "./utils";
import { renderTemplate } from "./writer";

const getPostFiles = (inputDir: string): string[] => {
  const fullPath = join(cwd(), inputDir);
  if(!existsSync(fullPath)) throw new Error('Input directory does not exist');
  return readdirSync(fullPath).map(file => join(fullPath, file));
}

const createPosts = (files: string[], parser: Parser, dateType: InputSorts): Post[] => {
  const configuration: PostConfig = {
    dateFallback: dateType
  };
  return files.map(file => new Post(file, parser, configuration));
}

const createOutputFile = (outputDir: string, filename: string) => {
    if (!existsSync(join(cwd(), outputDir))) {
        mkdirSync(join(cwd(), outputDir));
    }
    return join(outputDir, `${filename}`);
};

export const createWebsite = () => {
    const conf = getConfigFile(argv);
    const files: string[] = getPostFiles(conf.input);
    const parser = createParser(conf.inputFormat).setup(conf);
    const posts: Post[] = createPosts(files, parser, conf.inputSort).sort((p1, p2) => p2.date - p1.date);
    const template = renderTemplate(posts, conf, parser.options);
    const outputFile = createOutputFile(conf.output, conf.filename);
    writeFileSync(outputFile, template);
    console.log(`Output blankpage to ${outputFile}`);
};
