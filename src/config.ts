import { existsSync, readFileSync } from "fs";
import { CONF_ERROR_MESSAGES, ConfigurationError } from "./config-error";
import { extname } from "path";
import { InputSorts, ParserTypes } from "./types";

export interface IBlankConfig {
  filename: string;
  title: string;
  input: string;
  inputSort: InputSorts;
  inputFormat: ParserTypes;
  output: string;
  slots: {
    subheader: string;
    header: string;
  };
}

export function getConfigFile(args: string[]) {
  const simplifiedArgs: string[] = args.slice(2);
  if (
    typeof simplifiedArgs[0] === "string" &&
    extname(simplifiedArgs[0]) === ".json" &&
    existsSync(simplifiedArgs[0])
  ) {
    return new BlankpageConfig(simplifiedArgs[0]);
  } else {
    throw Error("No input file specified");
  }
}

export class BlankpageConfig implements IBlankConfig {
  public filename: string;
  public title: string;
  public input: string;
  public inputSort: InputSorts;
  public inputFormat: ParserTypes;
  public output: string;
  public slots: { subheader: string; header: string };
  constructor(confpath: any) {
    const conf = getBlankConf(confpath);
    validate(conf);
    this.slots = { header: "", subheader: "" };
    this.title = conf.title || "";
    this.input = conf.input || "txt";
    this.inputSort = conf.inputSort || "fs";
    this.inputFormat = conf.inputFormat || "txt";
    this.output = conf.output || "dist";
    this.slots.header = conf.header || "";
    this.slots.subheader = conf.subheader || "";
    this.filename = conf.filename || "index.html";
  }
}

function getBlankConf(confpath: string) {
  if (existsSync(confpath)) {
    return JSON.parse(readFileSync(confpath).toString());
  }
  throw new ConfigurationError(CONF_ERROR_MESSAGES.CONFIG_FILE_MISSING);
}

function validate(config: IBlankConfig) {
  if (isUndefined(config, "input")) {
    throw new ConfigurationError(CONF_ERROR_MESSAGES.NO_INPUT_DEFINED);
  }
  if (isUndefined(config, "output")) {
    throw new ConfigurationError(CONF_ERROR_MESSAGES.NO_OUTPUT_DEFINED);
  }
  if (
    !isUndefined(config, "inputSort") &&
    !["fs", "git"].some(type => type === config.inputSort)
  ) {
    throw new ConfigurationError(CONF_ERROR_MESSAGES.INVALID_INPUT_TYPE);
  }
}

function isUndefined(object: object, property: string) {
  return !object.hasOwnProperty(property);
}
