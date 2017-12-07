import {
    appendFileSync,
    existsSync,
    mkdirSync,
    readdirSync,
    readFileSync,
    rename,
    statSync,
    writeFileSync,
} from "fs";
import {
    extname,
    join,
} from "path";
import {
    argv,
    cwd,
} from "process";
import Config from "./config";

function getConfigFile(args) {
    const simplifiedArgs: string[] = args.slice(2);
    if (typeof simplifiedArgs[0] === "string" &&
        extname(simplifiedArgs[0]) === ".json" &&
        existsSync(simplifiedArgs[0])) {
        return simplifiedArgs[0];
    } else {
        throw Error("No input file specified");
    }
}

function getIndexTemplate(data) {
    const templatePath = join(cwd(), "template.html");
    const templateExists = existsSync(templatePath);
    if (!templateExists) {
        throw Error("no template file");
    }
    let template = readFileSync(templatePath).toString();
    for (const opt of Object.keys(data)) {
        template = template.replace(`<//${opt.toUpperCase()}//>`, data[opt]);
    }
    return template.split("<//CONTENT//>");
}

function getFileContent(filePath) {
    const fileExists = existsSync(filePath);
    return fileExists ? readFileSync(filePath).toString().split("\n") : "";
}

function getAllFileContent(inputDir) {
    const textFiles = readdirSync(join(cwd(), inputDir)).reverse();
    return textFiles.reduce((output, file) => {
        return output.concat(getFileContent(join(cwd(), inputDir, file)));
    }, []);
}

function createOutputFile(outputDir, filename) {
    if (!existsSync(join(cwd(), outputDir))) {
        mkdirSync(join(cwd(), outputDir));
    }
    return join(outputDir, `${filename}`);
}

export default function createWebsite() {
    const configFile = getConfigFile(argv);
    const Configuration = new Config(configFile);
    const OutputFile = createOutputFile(Configuration.output, Configuration.filename);
    const template = getIndexTemplate(Configuration);
    const fileContent = getAllFileContent(Configuration.input);
    writeFileSync(OutputFile, template[0]);
    fileContent.forEach((line) => {
        if (line !== "") {
            appendFileSync(OutputFile, `<p>${line}</p>`);
        }
    });
    appendFileSync(OutputFile, template[1]);
}
