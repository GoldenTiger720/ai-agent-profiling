import axios from "axios";

// YouTube Data API configuration
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

/**
 * Extracts the YouTube channel username from a given URL
 * @param url - The YouTube channel URL
 * @returns The extracted username or null if invalid
 */
export function extractYouTubeUsername(url: string): string | null {
  try {
    // Handle different YouTube URL formats
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Match @username format or channel/username format
    const match = pathname.match(/^\/(@[^/]+)|^\/channel\/([^/]+)/);

    if (match) {
      return (match[1] || match[2] || "").replace("@", "");
    }

    return null;
  } catch (error) {
    console.error("Invalid YouTube URL:", error);
    return null;
  }
}

/**
 * Interface for detailed YouTube channel information
 */
interface YouTubeChannelDetails {
  channelId: string;
  title: string;
  description: string;
  viewCount: string;
  subscriberCount: string;
  videoCount: string;
  topVideos: Array<{
    title: string;
    description: string;
    viewCount: string;
  }>;
}

/**
 * Fetches YouTube channel details using the YouTube Data API
 * @param username - The channel username
 * @returns Detailed channel information or null if not found
 */
export async function fetchYouTubeChannelDetails(
  username: string
): Promise<YouTubeChannelDetails | null> {
  try {
    // First, try to resolve channel by username
    let channelResponse = await axios.get(
      "https://youtube.googleapis.com/youtube/v3/channels",
      {
        params: {
          part: "snippet,statistics",
          forUsername: username,
          key: YOUTUBE_API_KEY,
        },
      }
    );

    // If no results, try by custom URL handle
    if (channelResponse.data.items.length === 0) {
      channelResponse = await axios.get(
        "https://youtube.googleapis.com/youtube/v3/channels",
        {
          params: {
            part: "snippet,statistics",
            forHandle: username,
            key: YOUTUBE_API_KEY,
          },
        }
      );
    }

    // If still no results, throw an error
    if (channelResponse.data.items.length === 0) {
      throw new Error("Channel not found");
    }

    // Get channel details
    const channelItem = channelResponse.data.items[0];
    const channelId = channelItem.id;

    // Fetch top videos for this channel
    const topVideos = await fetchTopVideos(channelId);

    return {
      channelId,
      title: channelItem.snippet.title,
      description: channelItem.snippet.description,
      viewCount: channelItem.statistics.viewCount,
      subscriberCount: channelItem.statistics.subscriberCount || "0",
      videoCount: channelItem.statistics.videoCount,
      topVideos,
    };
  } catch (error) {
    console.error("Error fetching YouTube channel details:", error);
    return null;
  }
}

/**
 * Fetches top videos for a given channel ID
 * @param channelId - The YouTube channel ID
 * @returns Array of top videos with title, description, and view count
 */
export async function fetchTopVideos(
  channelId: string
): Promise<Array<{ title: string; description: string; viewCount: string }>> {
  try {
    // Search for top videos in the channel
    const searchResponse = await axios.get(
      "https://youtube.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          channelId: channelId,
          maxResults: 5,
          order: "viewCount",
          type: "video",
          key: YOUTUBE_API_KEY,
        },
      }
    );

    // Get video IDs to fetch detailed statistics
    const videoIds = searchResponse.data.items
      .map((item: any) => item.id.videoId)
      .filter(Boolean)
      .join(",");

    // Fetch video statistics
    const statsResponse = await axios.get(
      "https://youtube.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "statistics",
          id: videoIds,
          key: YOUTUBE_API_KEY,
        },
      }
    );

    // Combine snippet and statistics
    return searchResponse.data.items.map((item: any, index: number) => {
      const stats = statsResponse.data.items.find(
        (statsItem: any) => statsItem.id === item.id.videoId
      );

      return {
        title: item.snippet.title,
        description: item.snippet.description,
        viewCount: stats?.statistics?.viewCount || "0",
      };
    });
  } catch (error) {
    console.error("Error fetching top videos:", error);
    return [];
  }
}

/**
 * Comprehensive YouTube channel analysis
 * @param url - The YouTube channel URL
 * @returns Detailed channel analysis or throws an error
 */
export async function analyzeYouTubeChannel(url: string) {
  // Extract username from URL
  const username = extractYouTubeUsername(url);

  if (!username) {
    throw new Error("Invalid YouTube channel URL");
  }

  // Fetch channel details
  const channelDetails = await fetchYouTubeChannelDetails(username);

  if (!channelDetails) {
    throw new Error("Could not fetch channel details");
  }

  return channelDetails;
}
