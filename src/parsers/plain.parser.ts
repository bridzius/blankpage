import { Parser, ParserOptions } from "./parser";
import { ParserTypes } from "../types";
export class PlainParser implements Parser {
    private parserType = ParserTypes.Plain;
    private parserOptions: ParserOptions = {};
    public get label() {
        return this.parserType;
    }
    public get options(): ParserOptions {
        return this.parserOptions;
    }
    public parse(fileContent: string): string {
        return fileContent;
    }
    public setup(): PlainParser {
        return this;
    }
}
