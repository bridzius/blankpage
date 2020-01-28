import { ParserTypes } from "./types";

export abstract class Parser {
  public abstract get label(): ParserTypes;
  public abstract parse(input: string): string;
}
