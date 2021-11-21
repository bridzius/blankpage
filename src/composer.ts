import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { argv, cwd } from "process";
import { getConfigFile } from "./config";
import { createParser } from "./parsers/parser-factory";
import { Post, PostConfig } from "./posts/post";
import { createPosts, getPostFiles } from "./reader";
import { renderTemplate } from "./writer";

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
    const posts: Post[] = createPosts(files, parser, conf.inputSort).sort(
        (p1, p2) => p2.date - p1.date
    );
    const template = renderTemplate(posts, conf, parser.options);
    const outputFile = createOutputFile(conf.output, conf.filename);
    writeFileSync(outputFile, template);
    console.log(`Output blankpage to ${outputFile}`);
};
