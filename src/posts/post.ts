import { readFileSync } from "fs";
import { Parser } from "../parsers";
import { extractMetadata } from "./post-metadata";
import { InputSorts } from "../types";
import { getFSDate, getGitDate } from './post.date';
export interface PostMetadata {
    title?: string;
    date?: string;
    [key: string]: string;
}
export interface PostConfig {
    dateFallback: InputSorts;
}
export class Post {
    public readonly title: string;
    public readonly metadata: PostMetadata;
    public readonly text: string;
    public readonly content: string;
    public readonly date: number;
    constructor(
        private file: string,
        private parser: Parser,
        private config: PostConfig
    ) {
        const post = readFileSync(file).toString();
        const extracted = extractMetadata(post);
        this.metadata = extracted.metadata;
        this.text = extracted.fileContent;
	this.content = this.parser.parse(this.text);
        this.title = this.metadata.title || "";
	this.date = this.metadata.date ? Date.parse(this.metadata.date) : this.getFallbackDate(this.config.dateFallback, this.file); 
    }
    private getFallbackDate(fallback: InputSorts, filePath: string): number {
	const errorMessage = "Date fallback format not defined";
	switch (fallback) {
	  case InputSorts.FileSystem:
	    return getFSDate(filePath);
	  case InputSorts.Git:
	    return getGitDate(filePath);
	  default:
	    throw new Error(errorMessage);
	}
    }
}
