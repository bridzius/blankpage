import { MarkdownParser } from "./md.parser";
import { ParserTypes } from "./parser";
import { PlainParser } from "./plain.parser";

export function createParser(type: ParserTypes) {
  switch (type) {
    case ParserTypes.Markdown:
      return new MarkdownParser();
    case ParserTypes.Plain:
      return new PlainParser();
  }
}
