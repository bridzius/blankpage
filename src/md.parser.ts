import { Parser } from "./parser";
import * as marked from "marked";
import { readFileSync } from "fs";
import { ParserTypes } from "./types";

export class MarkdownParser implements Parser {
  private _parserType = ParserTypes.Markdown;
  public get label() {
    return this._parserType;
  }
  public parse(inputFile: string): string {
    return marked(readFileSync(inputFile).toString());
  }
}
