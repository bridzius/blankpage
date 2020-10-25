import { IBlankConfig } from "../config";
import { ParserTypes } from "../types";

export interface ParserOptions {
    addStyle?: string;
    addStyleExt?: string;
}

export abstract class Parser {
    public abstract get label(): ParserTypes;
    public abstract parse(input: string): string;
    public abstract setup(config: IBlankConfig): ParserOptions;
}
