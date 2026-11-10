import { getCollection, type CollectionEntry } from 'astro:content';

export async function getLatestBroadcasts(
  lang: 'en' | 'tr' = 'en',
  limit = 5
): Promise<CollectionEntry<'broadcasts'>[]> {
  const broadcasts = await getCollection('broadcasts', ({ data }) => data.lang === lang);
  return broadcasts
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
    .slice(0, limit);
}
