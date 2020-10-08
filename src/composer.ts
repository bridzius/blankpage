import { execSync } from "child_process";
import {
    existsSync,
    mkdirSync,
    readdirSync,
    statSync,
    writeFileSync,
} from "fs";
import { join } from "path";
import { argv, cwd } from "process";
import { getConfigFile } from "./config";
import { renderTemplate } from "./templater";
import { createParser } from "./parser-factory";
import { InputSorts, ParserTypes, TimedFile } from "./types";
import { sortCompare } from "./utils";


const parseFileContent = (
    files: string[],
    inputFormat: ParserTypes
): string[] => {
    const existingFiles = files.filter((file) => existsSync(file));
    const parser = createParser(inputFormat);
    return existingFiles.map((file) => {
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
    const foundFiles: TimedFile[] = textFiles.map((file) => {
        return {
            name: join(cwd(), inputDir, file),
            times: {
                git: getGitDate(join(inputDir, file)),
                fs: getFSDate(join(cwd(), inputDir, file)),
            },
        };
    });
    return sortFilesByTimeType(foundFiles, inputType)
        .reverse()
        .map((f) => f.name);
};

/**
 * @description Sorts files by preferred date (fs or git). If git dates are the same (for example bulk commit) - falls back to file system time.
 * @param files Array of Timed files
 * @param type Input sorting type: git or filesystem.
 */
const sortFilesByTimeType = (
    files: TimedFile[],
    type: InputSorts
): TimedFile[] => {
    console.log(files);
    if (type === InputSorts.FileSystem) {
        return files.sort((f1, f2) => sortCompare(f1.times.fs, f2.times.fs));
    } else {
        return files.sort((f1, f2) => {
            if (f1.times.git === f2.times.git) {
                return sortCompare(f1.times.fs, f2.times.fs);
            } else {
                return sortCompare(f1.times.git, f2.times.git);
            }
        });
    }
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
    console.log(sortedFiles);
    const posts = parseFileContent(sortedFiles, conf.inputFormat);
    const template = renderTemplate(posts, conf);
    writeFileSync(outputFile, template);
    console.log(`Output blankpage to ${outputFile}`);
};
