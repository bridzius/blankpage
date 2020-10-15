import { MarkdownParser } from "./md.parser";
import { Parser } from "./parser";
import { PlainParser } from "./plain.parser";
import { ParserTypes } from "./types";

const instances: {
    [type: string]: Parser
} = {};

export const createParser = (type: ParserTypes) => {
    if(instances[type]) return instances[type];
    let instance: Parser;
    switch (type) {
        case ParserTypes.Markdown:
            instance = new MarkdownParser();
        case ParserTypes.Plain:
            instance =  new PlainParser();
    }
    instances[type] = instance;
    return instance
};
