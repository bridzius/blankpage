import { IBlankConfig } from "./config";
import { join } from "path";
import { cwd } from "process";
import { existsSync, readFileSync } from "fs";
import { ParserOptions } from "./parsers/parser";
import { Post } from "./posts/post";

const getHeadContent = (title: string, parserOpts: ParserOptions): string => {
    let head = "<head>";
    if (title) head += `\n<title>${title}</title>`;
    if (parserOpts.addStyle) {
        head += `\n<style>${parserOpts.addStyle}</style>`;
    }
    return head;
};

const getIndexTemplate = (data: IBlankConfig, parserOpts: ParserOptions) => {
    const templatePath = join(cwd(), "template.html");
    const templateExists = existsSync(templatePath);
    if (!templateExists) {
        throw Error("no template file");
    }
    let template = readFileSync(templatePath).toString();
    template = template.replace(
        "<head>",
        getHeadContent(data.title, parserOpts)
    );
    Object.keys(data.slots).forEach((slot: "header" | "subheader") => {
        template = template.replace(
            `<//${slot.toUpperCase()}//>`,
            data.slots[slot]
        );
    });
    return template.split("<//CONTENT//>");
};

export const renderTemplate = (
    posts: Post[],
    config: IBlankConfig,
    parserOpts: ParserOptions
) => {
    const template = getIndexTemplate(config, parserOpts);
    const content = posts.reduce(
        (current, post) =>
            (current += `<article>\n${post.content}</article>\n`),
        ""
    );
    const prettyTemplate = `
  ${template[0]}
  ${content}
  ${template[1]}
  `;
    return prettyTemplate;
};
