export interface Dictionary<T> {
    [key: string]: T;
}

export enum InputSorts {
    FileSystem = "fs",
    Git = "git",
}
export enum ParserTypes {
    Markdown = "md",
    Plain = "txt",
}
export interface TimedFile {
    name: string;
    times: {
        git: number;
        fs: number;
    };
}
