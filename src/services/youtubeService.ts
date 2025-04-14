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

    // Match different URL patterns
    // - /c/channelname
    // - /channel/ID
    // - /user/username
    // - /@username
    const match = pathname.match(
      /^\/(@[^/]+)|^\/channel\/([^/]+)|^\/c\/([^/]+)|^\/user\/([^/]+)/
    );

    if (match) {
      // Return the first non-undefined group
      return (match[1] || match[2] || match[3] || match[4] || "").replace(
        "@",
        ""
      );
    }

    // Try to get channel from video URL
    if (pathname.includes("/watch") && urlObj.searchParams.has("v")) {
      const videoId = urlObj.searchParams.get("v");
      // Note: You'd need to implement a function to fetch channel info from video ID
      return videoId;
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

    // Check if we have items in the response
    if (
      !channelResponse.data.items ||
      channelResponse.data.items.length === 0
    ) {
      // Try by custom URL handle
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

    // If still no results, try by channel ID
    if (
      !channelResponse.data.items ||
      channelResponse.data.items.length === 0
    ) {
      channelResponse = await axios.get(
        "https://youtube.googleapis.com/youtube/v3/channels",
        {
          params: {
            part: "snippet,statistics",
            id: username,
            key: YOUTUBE_API_KEY,
          },
        }
      );
    }

    // If still no results, throw an error
    if (
      !channelResponse.data.items ||
      channelResponse.data.items.length === 0
    ) {
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
      description: channelItem.snippet.description || "",
      viewCount: channelItem.statistics.viewCount || "0",
      subscriberCount: channelItem.statistics.subscriberCount || "0",
      videoCount: channelItem.statistics.videoCount || "0",
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

    // Check if we have items
    if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
      return [];
    }

    // Get video IDs to fetch detailed statistics
    const videoIds = searchResponse.data.items
      .map((item: any) => item.id?.videoId)
      .filter(Boolean)
      .join(",");

    // If no video IDs, return empty array
    if (!videoIds) {
      return [];
    }

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

    // Combine snippet and statistics with safety checks
    return searchResponse.data.items.map((item: any, index: number) => {
      const videoId = item.id?.videoId;

      const stats =
        videoId && statsResponse.data.items
          ? statsResponse.data.items.find(
              (statsItem: any) => statsItem.id === videoId
            )
          : null;

      return {
        title: item.snippet?.title || "Untitled Video",
        description: item.snippet?.description || "",
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
  try {
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
  } catch (error) {
    console.error("Error analyzing YouTube channel:", error);
    throw new Error(
      `Failed to analyze YouTube channel: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
