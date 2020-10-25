import { Parser, ParserOptions } from "./parser";
import { readFileSync } from "fs";
import { ParserTypes } from "../types";
import { IBlankConfig } from "../config";
export class PlainParser implements Parser {
    private parserType = ParserTypes.Plain;
    public get label() {
        return this.parserType;
    }
    public parse(inputFile: string): string {
        return readFileSync(inputFile).toString();
    }
    public setup(_config: IBlankConfig): ParserOptions {
        return {};
    }
}
