import { IBlankConfig } from './config';
import { join } from 'path';
import { cwd } from 'process';
import { existsSync, readFileSync } from 'fs';

export function renderTemplate(posts, config: IBlankConfig) {
  const template = getIndexTemplate(config);
  const content = posts.reduce(
    (current, post) => (current += `<article>\n${post}</article>\n`),
    ''
  );
  return `
  ${template[0]}
  ${content}
  ${template[1]}
  `;
}

function getIndexTemplate(data: IBlankConfig) {
  const templatePath = join(cwd(), 'template.html');
  const templateExists = existsSync(templatePath);
  if (!templateExists) {
    throw Error('no template file');
  }
  let template = readFileSync(templatePath).toString();
  template = template.replace('<head>', `<head>\n<title>${data.title}</title>`);
  for (const opt in data.slots) {
    if (data.slots.hasOwnProperty(opt)) {
      template = template.replace(
        `<//${opt.toUpperCase()}//>`,
        data.slots[opt]
      );
    }
  }
  return template.split('<//CONTENT//>');
}
