import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  schema: ({ image }) => {
    const ImageMedia = z.object({
      url: image(),
      title: z.string(),
      contentType: z.literal('image/jpeg').or(z.literal('image/png'))
    });
    const MediaItem = z.union([
      ImageMedia,
      z.object({
        url: z.string(),
        title: z.string(),
        contentType: z.literal('video/mp4')
      })
    ]);
    return z.object({
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
      // TODO: rename to media
      images: z.tuple([ImageMedia]).rest(MediaItem).optional()
    });
  }
});

const appsCollection = defineCollection({
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      appName: z.string(),
      icon: image(),
      link: z.string().url().optional(),
      theme: z.string(),
      unavailable: z.boolean().optional(),
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
