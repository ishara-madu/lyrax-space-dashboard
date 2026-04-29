import type { MetadataRoute } from 'next'
import clientPromise from "@/lib/mongodb";
import { sanitizeSlug } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: `${baseUrl}/schedule`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  try {
    const client = await clientPromise;
    const db = client.db("spacedash");
    const mongoDocs = await db.collection("launches").find({}).project({ slug: 1, launch_id: 1, updated_at: 1, _id: 0 }).toArray();
    
    const launchRoutes: MetadataRoute.Sitemap = mongoDocs.map((doc) => ({
      url: `${baseUrl}/launch/${sanitizeSlug(doc.slug) || doc.launch_id}`,
      lastModified: doc.updated_at ? new Date(doc.updated_at) : new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    }));
    
    return [...routes, ...launchRoutes];
  } catch (error) {
    console.warn("Failed to generate complete sitemap:", error);
    return routes;
  }
}
