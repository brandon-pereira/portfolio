import { Router } from '../utils/createRouter';
import writeJson from '../utils/writeJson';
import md2html from '../utils/md2html';
import AssetManager, { Asset, RawAsset } from '../utils/assetManager';

type Language = {
  _id: string;
  name: string;
  description: string;
  skillLevel: 'Pro' | 'Novice';
};

export type Project = {
  _id: string;
  index?: number;
  title: string;
  date?: string;
  languages: Language[];
  shortDescription?: string;
  description: string;
  type: 'Internal' | 'External';
  status: 'Live' | 'Unavailable' | 'Coming Soon';
  images: Asset[];
  link?: string;
  isPinned?: boolean;
  gitUrl?: string;
};

// Defines expected response from service
interface RawProject extends Omit<Partial<Project>, 'images'> {
  images: RawAsset[];
}

async function importProjects({
  assetManager,
  contentful
}: Router): Promise<void> {
  console.time('Getting projects');
  const rawData = (await contentful.getEntries('projects', {
    order: 'fields.isPinned,-fields.date'
  })) as RawProject[];
  const projects = await normalizeProjects(rawData, assetManager);
  await writeJson('projects.json', projects);
  console.timeEnd('Getting projects');
}

const normalizeProjects = (
  projects: RawProject[],
  assetManager: AssetManager
): Promise<Project[]> => {
  const normalizedProjects = projects.map(async (project): Promise<Project> => {
    const normalized = {} as Project;
    normalized._id = project._id || '';
    normalized.title = project.title || '';
    normalized.date = project.date
      ? // convert to ISO date then stringify
        new Date(project.date as string).toISOString().split('T')[0]
      : undefined;
    normalized.languages = project.languages || [];
    normalized.shortDescription = project.shortDescription;
    normalized.description =
      (project.description && (await md2html(project.description || ''))) || '';
    normalized.type = project.type || 'Internal';
    normalized.status = project.status || 'Unavailable';
    normalized.images = project.images
      ? project.images.map(img => assetManager.add(img))
      : [];
    normalized.link = project.link;
    normalized.isPinned = project.isPinned || undefined;
    normalized.gitUrl = project.gitUrl;
    return normalized;
  });
  return Promise.all(normalizedProjects);
};

export default importProjects;
