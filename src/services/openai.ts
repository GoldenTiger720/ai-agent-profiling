import axios from "axios";
import { analyzeYouTubeChannel } from "./youtubeService";

/**
 * Interface for OpenAI API response
 */
interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

/**
 * Interface for content analysis results
 */
interface ContentAnalysis {
  name?: string;
  personality?: string[];
  fieldOfActivity?: string;
  specialization?: string;
  experience?: string;
  summary?: string[];
}

/**
 * Get configuration for API keys
 * @returns Object with API keys from environment variables
 */
const getConfig = () => {
  // For Vite environment
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return {
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    };
  }
  return { apiKey: "" };
};

/**
 * Make an API call to OpenAI
 * @param systemPrompt System context for the AI
 * @param userPrompt User-specific prompt
 * @returns Generated text response
 */
async function callOpenAI(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  try {
    const config = getConfig();
    const OPENAI_API_KEY = config.apiKey;

    if (!OPENAI_API_KEY) {
      console.error("OpenAI API key is missing");
      throw new Error("OpenAI API key is not configured");
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.5,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    // Validate response structure
    if (
      !response.data ||
      !response.data.choices ||
      !response.data.choices[0]?.message?.content
    ) {
      throw new Error("Invalid response format from OpenAI API");
    }

    return response.data.choices[0].message.content;
  } catch (error: any) {
    // Comprehensive error handling
    const errorMessage =
      error.response?.data?.error?.message || error.message || "Unknown error";
    console.error("Error calling OpenAI:", errorMessage, error);

    if (error.response?.status === 401) {
      throw new Error("Authentication error: Please check your OpenAI API key");
    } else if (error.response?.status === 429) {
      throw new Error("Rate limit exceeded: Too many requests to OpenAI API");
    } else {
      throw new Error(`Failed to call OpenAI: ${errorMessage}`);
    }
  }
}

/**
 * Analyze content from various URL sources
 * @param url URL to analyze
 * @param urlType Type of URL (YouTube, LinkedIn, etc.)
 * @returns Analyzed profile content
 */
export async function analyzeUrl(
  url: string,
  urlType: string
): Promise<string> {
  // Special handling for YouTube URLs
  if (urlType === "YouTube URL") {
    try {
      // Analyze YouTube channel using YouTube Data API
      const channelData = await analyzeYouTubeChannel(url);

      // Prepare a detailed prompt for OpenAI to generate a profile
      const systemPrompt =
        "You are an expert at creating compelling professional profiles based on digital content. Create an engaging, first-person narrative that highlights the professional's unique strengths.";

      const userPrompt = `Create a professional profile based on the following YouTube channel details:

Channel Name: ${channelData.title}
Description: ${channelData.description}
Subscriber Count: ${channelData.subscriberCount}
Total View Count: ${channelData.viewCount}

Top Videos:
${channelData.topVideos
  .map(
    (video, index) => `
${index + 1}. ${video.title}
   Views: ${video.viewCount}
   Description: ${video.description}
`
  )
  .join("\n")}

Guidelines:
1. Write from a first-person perspective
2. Highlight the channel's unique value proposition
3. Identify key topics and areas of expertise
4. Create a profile suitable for speaking opportunities
5. Emphasize personality traits evident from the content
6. Include a compelling introduction and conclusion

Generate a comprehensive, engaging profile that showcases this professional's expertise and potential as a speaker.`;

      return await callOpenAI(systemPrompt, userPrompt);
    } catch (error) {
      console.error("Error analyzing YouTube channel:", error);
      throw new Error("Failed to analyze YouTube channel");
    }
  }

  // Generic URL analysis for other sources
  const systemPrompt =
    "You are an expert at extracting and summarizing professional information from various online sources. Provide a detailed, first-person profile based on the content.";

  const userPrompt = `URL Type: ${urlType}
URL: ${url}

Please analyze this URL thoroughly and extract key information about the professional. Create a comprehensive first-person profile that covers:
1. Professional background and expertise
2. Key skills and specializations
3. Unique value proposition
4. Personal personality traits
5. Career highlights or notable achievements

Write the profile in a first-person perspective, as if the person is speaking directly about themselves. Include a warm, engaging introduction and conclusion. Be creative and highlight the professional's strengths.

If the URL is not accessible or does not provide enough information, suggest potential areas of exploration based on the URL type.`;

  return callOpenAI(systemPrompt, userPrompt);
}

/**
 * Analyze PDF content and generate a professional profile
 * @param content Extracted text from PDF
 * @returns Generated profile content
 */
export async function analyzePdfContent(content: string): Promise<string> {
  const systemPrompt =
    "You should serve as a professional summarizing a client's introduction or resume. Please make it from a first person perspective. Include a greeting like 'Hello!' in your profile and a closing greeting in your profile closing.";
  const userPrompt =
    content +
    "\n\nAnalyze this content in detail and create a cool profile of yourself that briefly describes the speaker's topic, the benefits the speaker offers to the audience, and the personality of the speaker from a psychologist's perspective, including some fancy words. Write your profile in the first person.\n\n";

  return callOpenAI(systemPrompt, userPrompt);
}

/**
 * Synthesize multiple source profiles into a single comprehensive profile
 * @param results Array of source profiles
 * @returns Synthesized profile content
 */
export async function synthesizeResults(results: string[]): Promise<string> {
  const systemPrompt =
    "You are an expert at synthesizing multiple sources of professional information into a cohesive, compelling narrative. Create a unified first-person profile that captures the essence of the professional's unique journey and capabilities.";

  const userPrompt = `I have multiple professional profiles from different sources. Please synthesize these into a single, comprehensive first-person narrative:

${results
  .map(
    (result, index) => `Source ${index + 1}:
${result}
---`
  )
  .join("\n")}

Guidelines for synthesis:
1. Eliminate redundant information
2. Highlight consistent themes and unique insights
3. Create a flowing, engaging narrative
4. Maintain a first-person perspective
5. Showcase the professional's multifaceted expertise
6. Include a strong, memorable introduction and conclusion

Craft a profile that feels authentic, dynamic, and representative of the professional's true capabilities and personality.`;

  return callOpenAI(systemPrompt, userPrompt);
}

/**
 * Extract topics from the AI-generated profile
 * @param openAIResponse Generated profile text
 * @returns Array of extracted topics
 */
export function extractTopics(openAIResponse: string): string[] {
  try {
    const topicsRegex =
      /topics:.*?(?:\n|$)|areas of expertise:.*?(?:\n|$)|specializes in:.*?(?:\n|$)|field of activity:.*?(?:\n|$)|specialization:.*?(?:\n|$)/i;
    const topicsMatch = openAIResponse.match(topicsRegex);

    if (topicsMatch) {
      const topicsText = topicsMatch[0]
        .replace(
          /topics:|areas of expertise:|specializes in:|field of activity:|specialization:/i,
          ""
        )
        .trim();
      const topics = topicsText
        .split(/,|\sand\s/)
        .map((topic) => topic.trim())
        .filter(Boolean);
      return topics;
    }

    // Fallback to extracting potential topics from the text
    const potentialTopics = openAIResponse
      .split(/\.|,|\n/)
      .filter(
        (sentence) =>
          sentence.toLowerCase().includes("expert") ||
          sentence.toLowerCase().includes("specialist") ||
          sentence.toLowerCase().includes("focus on") ||
          sentence.toLowerCase().includes("specialized in")
      );

    if (potentialTopics.length > 0) {
      return potentialTopics.map((t) => t.trim()).filter(Boolean);
    }

    // Default topics if no extraction is successful
    return ["Leadership", "Communication", "Industry Expertise"];
  } catch (error) {
    console.error("Error extracting topics:", error);
    return ["Leadership", "Communication", "Industry Expertise"];
  }
}

/**
 * Extract personality traits from the AI-generated profile
 * @param openAIResponse Generated profile text
 * @returns Array of extracted personality traits
 */
export function extractPersonality(openAIResponse: string): string[] {
  try {
    const personalityRegex =
      /personality:.*?(?:\n|$)|characterized by:.*?(?:\n|$)|traits:.*?(?:\n|$)/i;
    const personalityMatch = openAIResponse.match(personalityRegex);

    if (personalityMatch) {
      const traitsText = personalityMatch[0]
        .replace(/personality:|characterized by:|traits:/i, "")
        .trim();
      const traits = traitsText
        .split(/,|\sand\s/)
        .map((trait) => trait.trim())
        .filter(Boolean);
      return traits;
    }

    // Fallback to extracting personality descriptors
    const potentialTraits = openAIResponse
      .split(/\.|,|\n/)
      .filter(
        (sentence) =>
          sentence.toLowerCase().includes("passionate") ||
          sentence.toLowerCase().includes("driven") ||
          sentence.toLowerCase().includes("enthusiastic") ||
          sentence.toLowerCase().includes("dynamic")
      );

    if (potentialTraits.length > 0) {
      return potentialTraits.map((t) => t.trim()).filter(Boolean);
    }

    // Default personality traits
    return ["Passionate", "Insightful", "Engaging", "Authoritative"];
  } catch (error) {
    console.error("Error extracting personality traits:", error);
    return ["Passionate", "Insightful", "Engaging", "Authoritative"];
  }
}

/**
 * Extract summary from the AI-generated profile
 * @param openAIResponse Generated profile text
 * @returns Array of summary paragraphs or default summary
 */
export function extractSummary(openAIResponse: string): any {
  try {
    const paragraphs = openAIResponse.split(/\n\n+/);
    if (paragraphs.length > 0) {
      return paragraphs;
    }
  } catch (error) {
    console.error("Error extracting summary:", error);
  }

  return ["An experienced professional with expertise in their field."];
}
