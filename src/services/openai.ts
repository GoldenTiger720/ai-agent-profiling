import axios from "axios";

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface ContentAnalysis {
  name?: string;
  personality?: string[];
  fieldOfActivity?: string;
  specialization?: string;
  experience?: string;
  summary?: string[];
}

// Configuration handling for browser environment
const getConfig = () => {
  // For Vite
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return {
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    };
  }
};

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

    if (
      !response.data ||
      !response.data.choices ||
      !response.data.choices[0]?.message?.content
    ) {
      throw new Error("Invalid response format from OpenAI API");
    }

    return response.data.choices[0].message.content;
  } catch (error: any) {
    // Improved error handling with more context
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

export async function analyzePdfContent(content: string): Promise<string> {
  const systemPrompt =
    "You should serve as a professional summarizing a client's introduction or resume. Please make it from a first person perspective. Include a greeting like 'Hello!' in your profile and a closing greeting in your profile closing.";
  const userPrompt =
    content +
    "\n\nAnalyze this content in detail and create a cool profile of yourself that briefly describes the speaker's topic, the benefits the speaker offers to the audience, and the personality of the speaker from a psychologist's perspective, including some fancy words. Write your profile in the first person.\n\n";

  return callOpenAI(systemPrompt, userPrompt);
}

export async function analyzeUrl(
  url: string,
  urlType: string
): Promise<string> {
  const systemPrompt =
    "You should extract the keywords from the speakers' URLs and summarize the content";
  const userPrompt = `${url}\nPlease analyze this ${urlType} in detail and extract the content in the following format:\nName:\nPersonality:\nField of activity:\nSpecialization:\nExperience and qualifications:`;

  return callOpenAI(systemPrompt, userPrompt);
}

export async function synthesizeResults(results: string[]): Promise<string> {
  const systemPrompt =
    "You should synthesize multiple pieces of information about a speaker into a cohesive first-person profile. Include a greeting like 'Hello!' in your profile and a closing greeting in your profile closing.";
  const userPrompt = `Here are multiple analyses of a speaker from different sources:\n\n${results.join(
    "\n\n---\n\n"
  )}\n\nSynthesize this information into a comprehensive first-person speaker profile that briefly describes the speaker's topic, the benefits the speaker offers to the audience, and the personality of the speaker from a psychologist's perspective, including some fancy words. Write the profile in the first person.`;

  return callOpenAI(systemPrompt, userPrompt);
}

// Helper functions to parse the OpenAI response
export function extractTopics(openAIResponse: string): string[] {
  // Looking for topics section in the response
  try {
    // Look for field of activity or specialization
    const topicsRegex =
      /topics:.*?(?:\n|$)|areas of expertise:.*?(?:\n|$)|specializes in:.*?(?:\n|$)|field of activity:.*?(?:\n|$)|specialization:.*?(?:\n|$)/i;
    const topicsMatch = openAIResponse.match(topicsRegex);

    if (topicsMatch) {
      // Extract topics by splitting on commas or "and" and clean up
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

    // If no specific topics section, try to identify potential topics
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

    // Fallback to extracting nouns that could be topics
    return ["Leadership", "Communication", "Industry Expertise"];
  } catch (error) {
    console.error("Error extracting topics:", error);
    return ["Leadership", "Communication", "Industry Expertise"];
  }
}

export function extractPersonality(openAIResponse: string): string[] {
  try {
    // Looking for personality section in the response
    const personalityRegex =
      /personality:.*?(?:\n|$)|characterized by:.*?(?:\n|$)|traits:.*?(?:\n|$)/i;
    const personalityMatch = openAIResponse.match(personalityRegex);

    if (personalityMatch) {
      // Extract personality traits by splitting on commas or "and" and clean up
      const traitsText = personalityMatch[0]
        .replace(/personality:|characterized by:|traits:/i, "")
        .trim();
      const traits = traitsText
        .split(/,|\sand\s/)
        .map((trait) => trait.trim())
        .filter(Boolean);
      return traits;
    }

    // If no specific personality section, try to identify sentences with personality descriptors
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

    // Fallback to common positive personality traits
    return ["Passionate", "Insightful", "Engaging", "Authoritative"];
  } catch (error) {
    console.error("Error extracting personality traits:", error);
    return ["Passionate", "Insightful", "Engaging", "Authoritative"];
  }
}

export function extractSummary(openAIResponse: string): any {
  try {
    const paragraphs = openAIResponse.split(/\n\n+/);
    if (paragraphs.length > 0) {
      return paragraphs;
    }
  } catch (error) {
    console.error("Error extracting summary:", error);
    return "An experienced professional with expertise in their field.";
  }
}
