import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const projectsCollection = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
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
      date: z.iso.datetime().pipe(z.coerce.date()),
      description: z.string().optional(),
      color: z.string().default('#0067FF'),
      gitUrl: z.string().url().optional(),
      link: z.string().url().optional(),
      isPinned: z.boolean().optional(),
      pinPriority: z
        .enum(['low', 'medium', 'high'])
        .optional()
        .default('medium'),
      languages: z
        .preprocess(val => {
          const _val = val as string;
          if (!_val.length) {
            return [];
          }
          return _val?.split(',');
        }, z.array(z.string()).optional())
        .optional(),
      media: z.tuple([ImageMedia]).rest(MediaItem).optional()
    });
  }
});

const appsCollection = defineCollection({
  loader: glob({ base: './src/content/apps', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      appName: z.string(),
      icon: image(),
      link: z.string().url().optional(),
      theme: z.string(),
      unavailable: z.boolean().optional(),
      media: z
        .array(z.object({ url: image(), title: z.string() }))
        .optional()
        .default([])
    })
});

const blogPostCollection = defineCollection({
  loader: glob({ base: './src/content/blogPosts', pattern: '**/*.{md,mdx}' }),
  schema: () =>
    z.object({
      title: z.string(),
      datePosted: z.iso.datetime().pipe(z.coerce.date())
    })
});

export const collections = {
  projects: projectsCollection,
  apps: appsCollection,
  blogPosts: blogPostCollection
};
