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
      isPinned: z.boolean().optional(),
      languages: z
        .preprocess(val => {
          const _val = val as string;
          if (!_val.length) {
            return [];
          }
          return _val?.split(',');
        }, z.array(z.string()).optional())
        .optional(),
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
