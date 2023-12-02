import { getCollection } from 'astro:content';

export async function getSortedProjects() {
  return (await getCollection('projects')).sort((a, b) => {
    if (a.data.isPinned && !b.data.isPinned) {
      return -1;
    }
    if (b.data.isPinned && !a.data.isPinned) {
      return 1;
    }
    return b.data.date.getTime() < a.data.date.getTime() ? -1 : 1;
  });
}
