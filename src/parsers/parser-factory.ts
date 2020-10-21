import { MarkdownParser } from "./md.parser";
import { Parser } from "./parser";
import { PlainParser } from "./plain.parser";
import { Dictionary, ParserTypes } from "../types";

const instances: Dictionary<Parser> = {};

export const createParser = (type: ParserTypes) => {
    if (instances[type]) return instances[type];
    instances[type] = chooseParser(type);
    return instances[type];
};

const chooseParser = (type: ParserTypes): Parser => {
    switch (type) {
        case ParserTypes.Markdown:
            return new MarkdownParser();
        case ParserTypes.Plain:
            return new PlainParser();
        default:
            throw new TypeError("Encountered an incompatible parser type.");
    }
};
