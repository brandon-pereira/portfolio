import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      title: z.string(),
      date: z.string().datetime().pipe(z.coerce.date()),
      description: z.string().optional(),
      primaryImage: image().optional(),
      color: z.string().default('red'),
      gitUrl: z.string().url().optional(),
      link: z.string().url().optional(),
      images: z
        .array(z.object({ url: image().optional(), title: z.string() }))
        .optional()
    })
});

const appsCollection = defineCollection({
  schema: ({ image }) =>
    z.object({
      _id: z.string(),
      appName: z.string(),
      icon: image(),
      theme: z.string()
    })
});

export const collections = {
  projects: projectsCollection,
  apps: appsCollection
};
