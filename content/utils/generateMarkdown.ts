export default function generateMarkdown(
  frontmatter: Record<string, any>,
  content: string
) {
  return `---
${Object.entries(frontmatter)
  // prettier-ignore
  .map(([key, value]) => value && `${key}: "${value}"`)
  .filter(Boolean)
  .join('\n')}
---
${content}
`;
}
