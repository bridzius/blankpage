import {
    existsSync,
    readFileSync,
} from "fs";
import ConfigurationError from "./config-error";

export default class BlankpageConfig {
    public filename: any;
    public title: string;
    public input: string;
    public inputType: string;
    public output: string;
    public header: string;
    public subheader: string;
    constructor(private confpath: any) {
        const conf = getBlankConf(confpath);
        validate(conf);
        this.title = conf.title || "";
        this.input = conf.input || "txt";
        this.inputType = conf.inputType || "fs";
        this.output = conf.output || "dist";
        this.header = conf.header || "";
        this.subheader = conf.subheader || "";
        this.filename = conf.filename || "index.html";
    }
}

function getBlankConf(confpath) {
   if (existsSync(confpath)) {
       return JSON.parse(readFileSync(confpath).toString());
   }
   throw new ConfigurationError("Configuration file does not exist");
}

function validate(config) {
    if (isUndefined(config, "input")) {
        throw new ConfigurationError("No input defined in website.json (input: 'dir where text files are')");
    }
    if (isUndefined(config, "output")) {
        throw new ConfigurationError("No output defined in website.json (output: 'outputDir')");
    }
    if (!isUndefined(config, "inputType") && !(["fs", "git"].some((type) => type === config.inputType))) {
        throw new ConfigurationError("Invalid input type. Choose from git|fs");
    }
}

function isUndefined(object: object, property: string) {
    return !object.hasOwnProperty(property);
}
