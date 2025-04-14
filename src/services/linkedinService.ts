import axios from "axios";

// LinkedIn API configuration - these should be environment variables
const LINKEDIN_CLIENT_ID =
  import.meta.env.VITE_LINKEDIN_CLIENT_ID || "86jtrzc4htz5ik";
const LINKEDIN_CLIENT_SECRET =
  import.meta.env.VITE_LINKEDIN_CLIENT_SECRET ||
  "WPL_AP1.rIT9WxkvVEWjP7MC.gzPDaA==";
const REDIRECT_URI =
  import.meta.env.VITE_LINKEDIN_REDIRECT_URI ||
  window.location.origin + "/linkedin-callback";

// LinkedIn profile data interface
export interface LinkedInProfileData {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  headline?: string;
  summary?: string;
  industry?: string;
  location?: {
    country?: string;
    city?: string;
  };
  positions?: Array<{
    title: string;
    companyName: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
  }>;
  skills?: string[];
  education?: Array<{
    schoolName: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

/**
 * Generates the LinkedIn OAuth authorization URL
 * @returns URL to redirect the user for LinkedIn authorization
 */
export function getLinkedInAuthUrl(): string {
  const scope = encodeURIComponent("r_liteprofile r_emailaddress");

  return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${scope}&state=${generateRandomState()}`;
}

/**
 * Generate a random state value for OAuth security
 */
function generateRandomState(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Exchange authorization code for access token
 * @param code Authorization code from LinkedIn callback
 * @returns Access token response
 */
export async function getAccessToken(
  code: string
): Promise<{ access_token: string; expires_in: number }> {
  try {
    const response = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
          client_id: LINKEDIN_CLIENT_ID,
          client_secret: LINKEDIN_CLIENT_SECRET,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return {
      access_token: response.data.access_token,
      expires_in: response.data.expires_in,
    };
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    throw new Error("Failed to get LinkedIn access token");
  }
}

/**
 * Fetch basic profile data from LinkedIn
 * @param accessToken LinkedIn access token
 * @returns Basic profile information
 */
export async function getBasicProfile(
  accessToken: string
): Promise<LinkedInProfileData> {
  try {
    // Fetch basic profile info
    const profileResponse = await axios.get("https://api.linkedin.com/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Fetch email address
    const emailResponse = await axios.get(
      "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Fetch profile picture
    const pictureResponse = await axios.get(
      "https://api.linkedin.com/v2/me?projection=(id,profilePicture(displayImage~:playableStreams))",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Extract profile picture URL if available
    let profilePicture = undefined;
    if (
      pictureResponse.data.profilePicture &&
      pictureResponse.data.profilePicture["displayImage~"] &&
      pictureResponse.data.profilePicture["displayImage~"].elements &&
      pictureResponse.data.profilePicture["displayImage~"].elements.length > 0
    ) {
      // Get the largest image
      const elements =
        pictureResponse.data.profilePicture["displayImage~"].elements;
      const largestImage = elements.reduce((prev, current) => {
        return prev.data["com.linkedin.digitalmedia.mediaartifact.StillImage"]
          .storageSize.width >
          current.data["com.linkedin.digitalmedia.mediaartifact.StillImage"]
            .storageSize.width
          ? prev
          : current;
      });

      profilePicture = largestImage.identifiers[0].identifier;
    }

    // Extract email from response
    let email = undefined;
    if (emailResponse.data.elements && emailResponse.data.elements.length > 0) {
      email = emailResponse.data.elements[0]["handle~"].emailAddress;
    }

    // Construct basic profile object
    const basicProfile: LinkedInProfileData = {
      id: profileResponse.data.id,
      firstName: profileResponse.data.localizedFirstName,
      lastName: profileResponse.data.localizedLastName,
      profilePicture,
      headline: profileResponse.data.headline,
      industry: profileResponse.data.industry,
      // Will be populated with additional data in other methods
      positions: [],
      skills: [],
      education: [],
    };

    return basicProfile;
  } catch (error) {
    console.error("Error fetching LinkedIn profile:", error);
    throw new Error("Failed to fetch LinkedIn profile data");
  }
}

/**
 * Extract LinkedIn profile data from a profile URL
 * This is a workaround since direct scraping is not allowed by LinkedIn
 * @param linkedinUrl LinkedIn profile URL
 * @returns Extracted profile data or error
 */
export async function extractLinkedInProfileFromUrl(
  linkedinUrl: string
): Promise<string> {
  // This would typically require authentication through LinkedIn API
  // Direct scraping is against LinkedIn's terms of service
  try {
    // Validate LinkedIn URL format
    const linkedInRegex =
      /^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)\/([-a-zA-Z0-9]+)\/*/i;
    if (!linkedInRegex.test(linkedinUrl)) {
      throw new Error("Invalid LinkedIn profile URL");
    }

    // Since we can't directly scrape LinkedIn, we need to use their API
    // This requires user authentication, which means we can only analyze the user's own profile
    // or use a 3rd party service that has LinkedIn API access

    // For now, we'll return a descriptive message about the limitation
    return `To analyze LinkedIn profile data from ${linkedinUrl}, the user needs to authorize access through LinkedIn's OAuth flow. Direct analysis of arbitrary LinkedIn profiles is not possible due to LinkedIn's API restrictions and terms of service.`;
  } catch (error) {
    console.error("Error processing LinkedIn URL:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to process LinkedIn URL: ${error.message}`);
    }
    throw new Error("Failed to process LinkedIn URL");
  }
}

/**
 * Get positions/experience data
 * Note: This requires additional permissions and would be implemented as part of
 * a complete LinkedIn integration
 */
export async function getPositions(accessToken: string): Promise<any[]> {
  try {
    // This endpoint is illustrative; LinkedIn's v2 API structures this differently
    const response = await axios.get("https://api.linkedin.com/v2/positions", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.elements || [];
  } catch (error) {
    console.error("Error fetching positions:", error);
    return [];
  }
}

/**
 * Get skills data
 * Note: This requires additional permissions and would be implemented as part of
 * a complete LinkedIn integration
 */
export async function getSkills(accessToken: string): Promise<string[]> {
  try {
    // This endpoint is illustrative; LinkedIn's v2 API structures this differently
    const response = await axios.get("https://api.linkedin.com/v2/skills", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.elements.map((skill: any) => skill.name) || [];
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

/**
 * Complete LinkedIn profile analysis using either direct API access or URL extraction
 * @param input Either a LinkedIn URL or an access token
 * @param isUrl Whether the input is a URL (true) or access token (false)
 * @returns Analyzed profile data or descriptive message
 */
export async function analyzeLinkedInProfile(
  input: string,
  isUrl: boolean = true
): Promise<string> {
  try {
    if (isUrl) {
      return await extractLinkedInProfileFromUrl(input);
    } else {
      // This is the access token flow
      const profile = await getBasicProfile(input);

      // Additional data that would require more API calls
      // const positions = await getPositions(input);
      // const skills = await getSkills(input);

      // Combine all profile data
      return JSON.stringify(profile, null, 2);
    }
  } catch (error) {
    console.error("Error analyzing LinkedIn profile:", error);
    if (error instanceof Error) {
      throw new Error(`LinkedIn profile analysis failed: ${error.message}`);
    }
    throw new Error("LinkedIn profile analysis failed");
  }
}
