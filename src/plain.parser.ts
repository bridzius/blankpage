import { Parser } from "./parser";
import { readFileSync } from "fs";
import { ParserTypes } from "./types";
export class PlainParser implements Parser {
  private _parserType = ParserTypes.Plain;
  public get label() {
    return this._parserType;
  }
  public parse(inputFile: string): string {
    return readFileSync(inputFile).toString();
  }
}
