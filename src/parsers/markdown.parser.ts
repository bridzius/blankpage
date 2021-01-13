import { Parser, ParserOptions } from "./parser";
import * as marked from "marked";
import { readFileSync } from "fs";
import { join, resolve, sep } from "path";
import { ParserTypes } from "../types";
import { IBlankConfig } from "../config";
import * as hljs from "highlight.js";
import { existsSync } from "fs";

export class MarkdownParser implements Parser {
    private parserType = ParserTypes.Markdown;
    private parserOptions = {};
    public get label() {
        return this.parserType;
    }
    public get options() {
        return this.parserOptions;
    }
    public parse(fileContent: string): string {
        return marked(fileContent);
    }
    public setup(config: IBlankConfig): MarkdownParser {
        let options: ParserOptions = {};
        if (typeof config.highlight !== "undefined") {
            const highlightModulePath = require
                .resolve("highlight.js")
                .split(sep);
            const highlightStyles = highlightModulePath
                .slice(0, highlightModulePath.indexOf("highlight.js") + 1)
                .concat(["styles", `${config.highlight}.css`]);
            const stylesPath = join(`${sep}`, ...highlightStyles);
            const pathExists = existsSync(stylesPath);
            const addStyle = pathExists
                ? readFileSync(stylesPath).toString()
                : "";
            options = { ...options, addStyle };
            marked.setOptions({
                langPrefix: "hljs language-",
                highlight: (code, lang) => {
                    return hljs.highlightAuto(code, [lang]).value;
                },
            });
        }
        this.parserOptions = options;
        return this;
    }
}
