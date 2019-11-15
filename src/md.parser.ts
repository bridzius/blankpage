import { Parser, ParserTypes } from './parser';
import * as marked from 'marked';
import { readFileSync } from 'fs';

export class MarkdownParser implements Parser {
  private _parserType = ParserTypes.Markdown;
  public get label() {
    return this._parserType;
  }
  public parse(inputFile): string {
    return marked(readFileSync(inputFile).toString());
  }
}
