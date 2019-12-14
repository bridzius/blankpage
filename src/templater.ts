import { IBlankConfig } from "./config";
import { join } from "path";
import { cwd } from "process";
import { existsSync, readFileSync } from "fs";

export function renderTemplate(posts: string[], config: IBlankConfig) {
  const template = getIndexTemplate(config);
  const content = posts.reduce(
    (current, post) => (current += `<article>\n${post}</article>\n`),
    ""
  );
  const prettyTemplate = `
  ${template[0]}
  ${content}
  ${template[1]}
  `;
  return prettyTemplate;
}

function getIndexTemplate(data: IBlankConfig) {
  const templatePath = join(cwd(), "template.html");
  const templateExists = existsSync(templatePath);
  if (!templateExists) {
    throw Error("no template file");
  }
  let template = readFileSync(templatePath).toString();
  template = template.replace("<head>", `<head>\n<title>${data.title}</title>`);
  Object.keys(data.slots).forEach((slot: "header" | "subheader") => {
    template = template.replace(
      `<//${slot.toUpperCase()}//>`,
      data.slots[slot]
    );
  });
  return template.split("<//CONTENT//>");
}
