export enum ParserTypes {
  Markdown = 'md',
  Plain = 'txt',
}

export abstract class Parser {
  public abstract get label(): ParserTypes;
  public abstract parse(input: string): string;
}
