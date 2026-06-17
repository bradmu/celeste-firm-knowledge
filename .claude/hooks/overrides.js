const LINE_RE = /(?:\/\/|\/\*|<!--)\s*ids-allow:\s*\S/;
const FILE_RE = /(?:\/\/|\/\*|<!--)\s*ids-allow-file:\s*\S/;
const CUSTOM_DIR = /(?:^|\/)src\/custom\//;

export function fileIsAllowlisted(content, filePath) {
  if (filePath && CUSTOM_DIR.test(filePath)) return true;
  const head = content.split('\n').slice(0, 5).join('\n');
  return FILE_RE.test(head);
}

export function lineIsAllowlisted(line) {
  return LINE_RE.test(line);
}
