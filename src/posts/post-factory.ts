import { Parser } from "../parsers";
import { Post } from "./post";
import { IBlankConfig } from '../config';

export const createPost = (postData: string, parser: Parser, config: IBlankConfig) => {
    return new Post(postData, parser, {dateFallback: config.inputSort});
}
