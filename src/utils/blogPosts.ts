import { getCollection } from 'astro:content';

export async function getSortedBlogPosts() {
  return (await getCollection('blogPosts')).sort((a, b) => {
    return b.data.datePosted.getTime() < a.data.datePosted.getTime() ? -1 : 1;
  });
}
