/**
 * Extracts the YouTube video ID from various YouTube URL formats.
 * @param url The YouTube URL to extract the ID from.
 * @returns The extracted video ID or null if not found.
 */
export function extractYoutubeVideoId(url: string | undefined): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  return match ? match[1] : null;
}

/**
 * Removes invisible characters (like Zero Width Space/Joiner) from a string.
 * This is used to fix 404 errors caused by malformed slugs in the database.
 */
export function sanitizeSlug(slug: string | null | undefined): string | null {
  if (!slug) return null;
  return slug.replace(/[^\x20-\x7E]/g, '');
}
