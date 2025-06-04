import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

type Project = CollectionEntry<'projects'>;

export async function getProjects() {
  return Array.from(await getCollection('projects'));
}

export function byPinned(a: Project, b: Project) {
  // If both are pinned, compare priority
  if (a.data.isPinned && b.data.isPinned) {
    const priorities = { high: 2, medium: 1, low: 0 };
    const aPriority = priorities[a.data.pinPriority ?? 'medium'];
    const bPriority = priorities[b.data.pinPriority ?? 'medium'];
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    return 0;
  }
  // If only one is pinned, it comes first
  if (a.data.isPinned && !b.data.isPinned) {
    return -1;
  }
  if (b.data.isPinned && !a.data.isPinned) {
    return 1;
  }
  // If neither is pinned, treat as equal
  return 0;
}

export function byCreationDate(a: Project, b: Project) {
  return b.data.date.getTime() < a.data.date.getTime() ? -1 : 1;
}
