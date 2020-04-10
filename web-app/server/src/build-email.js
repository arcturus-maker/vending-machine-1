import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

function loadTemplate(name) {
  const base = fileURLToPath(import.meta.url);
  const source = fs.readFileSync(path.join(base, '..', '..', 'email-template', `${name}.hbs`), 'utf8');
  return Handlebars.compile(source, { noEscape: true });
}

const subjectTemplate = loadTemplate('subject');
const bodyTemplate = loadTemplate('body');

export default ({ to, name, content }) => ({
  to,
  subject: subjectTemplate({ name }),
  body: bodyTemplate({ name, content })
});