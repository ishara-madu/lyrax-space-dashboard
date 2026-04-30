export interface Launch {
  id: string;
  name: string;
  net: string;
  webcast_live?: boolean;
  image: string | null;
  overview_html?: string;
  analysis_html?: string;
  status?: {
    name: string;
    abbrev: string;
  };
  launch_service_provider: {
    name: string;
  };
  vidURLs?: { url: string }[];
  mission?: {
    description: string;
    type: string;
    orbit?: {
      name: string;
    };
  };
  infographic?: string | null;
  rocket?: {
    configuration: {
      name: string;
      full_name: string;
      image_url?: string | null;
    };
  };
  pad?: {
    name: string;
    location: {
      name: string;
    };
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_SPACE_API_URL;

if (!API_BASE_URL) {
  throw new Error('Invalid/Missing environment variable: "NEXT_PUBLIC_SPACE_API_URL"');
}

export async function getUpcomingLaunches(limit: number = 10, offset: number = 0): Promise<Launch[]> {
  const safeLimit = Math.min(limit, 20);
  try {
    const res = await fetch(`${API_BASE_URL}/launch/upcoming/?limit=${safeLimit}&offset=${offset}&mode=detailed`, {
      next: { revalidate: 60 * 15, tags: ["launches"] },
    });

    if (!res.ok) {
      console.error("Failed to fetch upcoming launches");
      return [];
    }

    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching launches:", error);
    return [];
  }
}

export async function getPreviousLaunches(limit: number = 1, offset: number = 0): Promise<Launch[]> {
  const safeLimit = Math.min(limit, 20);
  try {
    const res = await fetch(`${API_BASE_URL}/launch/previous/?limit=${safeLimit}&offset=${offset}&mode=detailed`, {
      next: { revalidate: 60 * 15, tags: ["launches"] },
    });

    if (!res.ok) {
      console.error("Failed to fetch previous launches");
      return [];
    }

    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching previous launches:", error);
    return [];
  }
}

export async function getLaunchById(id: string): Promise<Launch | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/launch/${id}/`, {
      next: { revalidate: 60 * 15, tags: ["launches"] },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      console.error(`Failed to fetch launch ${id}`);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching launch ${id}:`, error);
    return null;
  }
}
