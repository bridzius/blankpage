import { MarkdownParser } from "./md.parser";
import { PlainParser } from "./plain.parser";
import { ParserTypes } from "./types";

export const createParser = (type: ParserTypes) => {
    switch (type) {
        case ParserTypes.Markdown:
            return new MarkdownParser();
        case ParserTypes.Plain:
            return new PlainParser();
    }
};
