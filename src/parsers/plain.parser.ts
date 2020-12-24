import { Parser, ParserOptions } from "./parser";
import { readFileSync } from "fs";
import { ParserTypes } from "../types";
import { IBlankConfig } from "../config";
export class PlainParser implements Parser {
    private parserType = ParserTypes.Plain;
    private parserOptions = {};
    public get label() {
        return this.parserType;
    }
    public get options() {
        return this.parserOptions;
    }
    public parse(fileContent: string): string {
        return fileContent;
    }
    public setup(_config: IBlankConfig): PlainParser {
        return this;
    }
}
