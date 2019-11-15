import { Parser, ParserTypes } from './parser';
import { readFileSync } from 'fs';
export class PlainParser implements Parser {
  private _parserType = ParserTypes.Plain;
  public get label() {
    return this._parserType;
  }
  public parse(inputFile): string {
    return readFileSync(inputFile).toString();
  }
}
