import { existsSync, readdirSync } from "fs";
import { join } from "path";
import { cwd } from "process";
import { Parser } from "./parsers";
import { Post, PostConfig } from "./posts";
import { InputSorts } from "./types";


export const getPostFiles = (inputDir: string): string[] => {
    const fullPath = join(cwd(), inputDir);
    if (!existsSync(fullPath))
        throw new Error("Input directory does not exist");
    return readdirSync(fullPath).map((file) => join(fullPath, file));
};

export const createPosts = (
    files: string[],
    parser: Parser,
    dateType: InputSorts
): Post[] => {
    const configuration: PostConfig = {
        dateFallback: dateType,
    };
    return files.map((file) => new Post(file, parser, configuration));
};