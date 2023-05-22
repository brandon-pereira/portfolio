import { defineCollection, z } from "astro:content";

const projectsCollection = defineCollection({
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      title: z.string(),
      date: z.string().datetime().pipe(z.coerce.date()),
      description: z.string().optional(),
      primaryImage: image().optional(),
      color: z.string().default("red"),
    }),
});

export const collections = {
  projects: projectsCollection,
};
