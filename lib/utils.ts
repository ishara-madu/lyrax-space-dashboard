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
