import { existsSync, readFileSync } from "fs";
import { CONF_ERROR_MESSAGES, ConfigurationError } from "./config-error";

export interface IBlankConfig {
  filename: string;
  title: string;
  input: string;
  inputType: string;
  output: string;
  slots: {
    subheader: string;
    header: string;
  };
}

export class BlankpageConfig implements IBlankConfig {
  public filename: string;
  public title: string;
  public input: string;
  public inputType: string;
  public output: string;
  public slots: { subheader: string; header: string };
  constructor(private confpath: any) {
    const conf = getBlankConf(confpath);
    validate(conf);
    this.slots = { header: "", subheader: "" };
    this.title = conf.title || "";
    this.input = conf.input || "txt";
    this.inputType = conf.inputType || "fs";
    this.output = conf.output || "dist";
    this.slots.header = conf.header || "";
    this.slots.subheader = conf.subheader || "";
    this.filename = conf.filename || "index.html";
  }
}

function getBlankConf(confpath) {
  if (existsSync(confpath)) {
    return JSON.parse(readFileSync(confpath).toString());
  }
  throw new ConfigurationError(CONF_ERROR_MESSAGES.CONFIG_FILE_MISSING);
}

function validate(config) {
  if (isUndefined(config, "input")) {
    throw new ConfigurationError(CONF_ERROR_MESSAGES.NO_INPUT_DEFINED);
  }
  if (isUndefined(config, "output")) {
    throw new ConfigurationError(CONF_ERROR_MESSAGES.NO_OUTPUT_DEFINED);
  }
  if (
    !isUndefined(config, "inputType") &&
    !["fs", "git"].some((type) => type === config.inputType)
  ) {
    throw new ConfigurationError(CONF_ERROR_MESSAGES.INVALID_INPUT_TYPE);
  }
}

function isUndefined(object: object, property: string) {
  return !object.hasOwnProperty(property);
}
