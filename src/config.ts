import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { cwd, argv } from "process";
import * as minimist from "minimist";

export interface BlankpageConfig {
    postDir?: string;
    outDir?: string;
}

const filterConfigProperties: (configObject: object) => BlankpageConfig = (
    configObject
) =>
    Object.values(configObject)
        .filter(([confKey]) => Object.keys(defaultConfig).includes(confKey))
        .reduce(
            (conf, [confKey, confValue]) => ({ ...conf, [confKey]: confValue }),
            {}
        );

const defaultConfig: BlankpageConfig = {
    postDir: "posts",
    outDir: "out",
};

const getFileConfig: () => BlankpageConfig = () => {
    const configFile = join(cwd(), "website.json");
    return existsSync(configFile)
        ? filterConfigProperties(
              JSON.parse(readFileSync(configFile).toString())
          )
        : defaultConfig;
};

const getArgConfig: () => BlankpageConfig = () =>
    filterConfigProperties(minimist(argv.slice(2)));

export const getConfig: () => Required<BlankpageConfig> = () =>
    ({
        ...defaultConfig,
        ...getFileConfig(),
        ...getArgConfig(),
    } as Required<BlankpageConfig>);
