import { Router } from "../utils/createRouter";
import writeJson from "../utils/writeJson";
import md2html from "../utils/md2html";
import AssetManager, { Asset, RawAsset } from "../utils/assetManager";
import { writeFile } from "fs-extra";
import slugify from "slugify";
import { join } from "path";
import generateMarkdown from "../utils/generateMarkdown";
import Vibrant from "node-vibrant";

type Language = {
  _id: string;
  name: string;
  description: string;
};

type RawLanguage = {
  disableProjectsConnection?: boolean;
} & Language;

export type Project = {
  id: string;
  index?: number;
  title: string;
  date?: string;
  languages: Language[];
  thumbnail?: Asset;
  shortDescription?: string;
  description: string;
  type: "Internal" | "External";
  status: "Live" | "Unavailable" | "Coming Soon";
  images: Asset[];
  link?: string;
  isPinned?: boolean;
  gitUrl?: string;
  color?: string;
};

// Defines expected response from service
interface RawProject extends Omit<Partial<Project>, "languages" | "images"> {
  _id: string;
  images: RawAsset[];
  languages: RawLanguage[];
}

async function importProjects({
  assetManager,
  contentful,
}: Router): Promise<void> {
  console.time("Getting projects");
  const rawData = (await contentful.getEntries("projects", {
    order: "fields.isPinned,-fields.date",
  })) as RawProject[];
  const projects = await normalizeProjects(rawData, assetManager);
  // await writeJson("projects.json", projects);
  await Promise.all(
    projects.map((project) =>
      writeFile(
        `./src/content/projects/${slugify(project.title, {
          lower: true,
          remove: /[*+~.()'"!/:@]/g,
        })}.md`,
        generateMarkdown(
          {
            ...project,
            // prettier-ignore
            title: project.title.replace(":", "\:"),
            description: project.shortDescription,
            shortDescription: null,
            languages: project.languages.map((lang) => lang.name).join(", "),
            primaryImage:
              project.images?.[0]?.url &&
              `../../assets/${project.thumbnail?.url}`,
          },
          project.description
        )
      )
    )
  );
  console.timeEnd("Getting projects");
}

const normalizeProjects = (
  projects: RawProject[],
  assetManager: AssetManager
): Promise<Project[]> => {
  const normalizedProjects = projects.map(async (project): Promise<Project> => {
    const normalized = {} as Project;

    normalized.id = project._id || "";
    normalized.title = project.title || "";
    normalized.date = project.date
      ? // convert to ISO date then stringify
        new Date(project.date as string).toISOString()
      : undefined;
    normalized.languages = (project.languages || [])
      // remove incorrectly formatted
      .filter((lang) => lang._id && lang.name && lang.description)
      // remove where not wanted
      .filter((lang) => !lang.disableProjectsConnection)
      // normalize object
      .map((lang) => ({
        _id: lang._id,
        name: lang.name,
        description: lang.description,
      }));
    normalized.shortDescription = project.shortDescription;
    normalized.description = project.description || "";
    normalized.type = project.type || "Internal";
    normalized.status = project.status || "Unavailable";
    normalized.images = project.images
      ? project.images.map((img) => assetManager.add(img))
      : [];
    normalized.thumbnail = project.images
      ? assetManager.add(project.images[0], { jpg: true })
      : undefined;
    normalized.link = project.link;
    normalized.isPinned = project.isPinned || undefined;
    normalized.gitUrl = project.gitUrl;
    if (!normalized.thumbnail?.url) return normalized;
    const colors = await Vibrant.from(
      join(process.cwd(), "src", "assets", normalized.thumbnail?.url)
    ).getPalette();

    normalized.color = colors.Vibrant?.hex;
    return normalized;
  });
  return Promise.all(normalizedProjects);
};

export default importProjects;
