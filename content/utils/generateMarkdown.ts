export default function generateMarkdown(
  frontmatter: Record<string, any>,
  content: string
) {
  return `---
${Object.entries(frontmatter)
  // prettier-ignore
  .map(([key, value]) => renderFrontmatterRow(key, value))
  .filter(Boolean)
  .join('\n')}
---

${content.trim()}
`;
}

function renderFrontmatterRow(key: string, value: any) {
  if (!value) return null;
  if (value && Array.isArray(value)) {
    if (!value.length) {
      return null;
    }
    // return null;
    return `${key}: [
      ${value.map(v => `${JSON.stringify(v, null, '\t')}`).join(',')}]`;
  }
  if (typeof value === 'string') {
    value = value.replace("'", "''");
  }
  return `${key}: '${value}'`;
}
