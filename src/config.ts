import { existsSync, readFileSync } from "fs";
import { ConfigurationErrorMessages, ConfigurationError } from "./config-error";
import { join, extname } from "path";
import { cwd } from "process";
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
    highlight: string | undefined;
}

export function getFileConfig() {
	const configFile = join(cwd(), 'website.json');
	return existsSync(configFile) ? readFileSync(configFile) : {};
}
export function getArgConfig() {
	//TODO: Add argument overrides for all config options
	return {};
}

export const getConfigFile = (args: string[]) => {
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
};

export class BlankpageConfig implements IBlankConfig {
    public filename: string;
    public title: string;
    public input: string;
    public inputSort: InputSorts;
    public inputFormat: ParserTypes;
    public output: string;
    public slots: { subheader: string; header: string };
    public highlight: string | undefined;
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
        this.highlight = conf.highlight;
    }
}

const getBlankConf = (confpath: string) => {
    if (existsSync(confpath)) {
        return JSON.parse(readFileSync(confpath).toString());
    }
    throw new ConfigurationError(ConfigurationErrorMessages.ConfigFileMissing);
};

const validate = (config: Partial<IBlankConfig>) => {
    if (isUndefined(config, "input")) {
        throw new ConfigurationError(ConfigurationErrorMessages.NoInputDefined);
    }
    if (isUndefined(config, "output")) {
        throw new ConfigurationError(
            ConfigurationErrorMessages.NoOutputDefined
        );
    }
    if (
        !isUndefined(config, "inputSort") &&
        !["fs", "git"].some((type) => type === config.inputSort)
    ) {
        throw new ConfigurationError(
            ConfigurationErrorMessages.InvalidInputType
        );
    }
};

const isUndefined = (object: Record<string, unknown>, property: string) => {
    return !object.hasOwnProperty(property);
};
