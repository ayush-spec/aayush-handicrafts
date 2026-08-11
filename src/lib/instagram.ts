/**
 * Instagram oEmbed integration.
 *
 * Uses Instagram's oEmbed endpoint to fetch embeddable HTML for posts.
 * This approach requires no API keys and works with public profiles.
 *
 * To use the Basic Display API instead (for more control), you would need:
 * - An Instagram App (Meta Developer Console)
 * - A long-lived token (refresh every 60 days)
 * - INSTAGRAM_ACCESS_TOKEN env variable
 */

export interface InstagramPost {
  url: string;
  html: string;
  thumbnailUrl: string;
  title: string;
  authorName: string;
}

/**
 * Fetch oEmbed data for a single Instagram post URL.
 */
export async function getInstagramOEmbed(postUrl: string): Promise<InstagramPost | null> {
  try {
    const oembedUrl = `https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(postUrl)}&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN || ''}&omitscript=true`;

    const res = await fetch(oembedUrl, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) return null;

    const data = await res.json();
    return {
      url: postUrl,
      html: data.html || '',
      thumbnailUrl: data.thumbnail_url || '',
      title: data.title || '',
      authorName: data.author_name || '',
    };
  } catch {
    return null;
  }
}

/**
 * Fetch oEmbed data for multiple Instagram post URLs.
 * Falls back gracefully — posts that fail to fetch are excluded.
 */
export async function getInstagramPosts(postUrls: string[]): Promise<InstagramPost[]> {
  const results = await Promise.all(postUrls.map(getInstagramOEmbed));
  return results.filter((p): p is InstagramPost => p !== null);
}
