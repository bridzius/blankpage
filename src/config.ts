import { existsSync, readFileSync } from "fs";
import ConfigurationError from "./config-error";

interface IBlankConfig {
  filename: any;
  title: string;
  input: string;
  inputType: string;
  output: string;
  header: string;
  subheader: string;
}

export default class BlankpageConfig implements IBlankConfig {
  public title: any;
  public input: any;
  public inputType: any;
  public output: any;
  public header: any;
  public subheader: any;
  public filename: any;
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
    throw new ConfigurationError(
      "No input defined in website.json (input: 'dir where text files are')",
    );
  }
  if (isUndefined(config, "output")) {
    throw new ConfigurationError(
      "No output defined in website.json (output: 'outputDir')",
    );
  }
  if (
    !isUndefined(config, "inputType") &&
    !["fs", "git"].some((type) => type === config.inputType)
  ) {
    throw new ConfigurationError("Invalid input type. Choose from git|fs");
  }
}

function isUndefined(object: object, property: string) {
  return !object.hasOwnProperty(property);
}
