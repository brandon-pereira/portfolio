import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      title: z.string(),
      date: z.string().datetime().pipe(z.coerce.date()),
      description: z.string().optional(),
      color: z.string().default('#0067FF'),
      gitUrl: z.string().url().optional(),
      link: z.string().url().optional(),
      images: z
        .array(z.object({ url: image(), title: z.string() }))
        .optional()
        .default([])
    })
});

const appsCollection = defineCollection({
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      appName: z.string(),
      icon: image(),
      theme: z.string(),
      images: z
        .array(z.object({ url: image(), title: z.string() }))
        .optional()
        .default([])
    })
});

export const collections = {
  projects: projectsCollection,
  apps: appsCollection
};
