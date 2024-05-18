import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

type Project = CollectionEntry<'projects'>;

export async function getProjects() {
  return Array.from(await getCollection('projects'));
}

export function byPinned(a: Project, b: Project) {
  if (a.data.isPinned && !b.data.isPinned) {
    return -1;
  }
  if (b.data.isPinned && !a.data.isPinned) {
    return 1;
  }
  return 0;
}

export function byCreationDate(a: Project, b: Project) {
  return b.data.date.getTime() < a.data.date.getTime() ? -1 : 1;
}
