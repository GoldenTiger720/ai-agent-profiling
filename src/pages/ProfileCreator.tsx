import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  FileText,
  Youtube,
  Globe,
  Linkedin,
  BookOpen,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import ContentUploader from "@/components/ContentUploader";
import SpeakerProfile from "@/components/SpeakerProfile";
import LinkedInConnect from "@/components/LinkedinConnect"; // Import the LinkedIn connect component
import axios from "axios";
import { extractTextFromPdf } from "@/services/pdfService";
import { analyzeLinkedInProfile } from "@/services/linkedinService"; // Import the LinkedIn service
import {
  analyzePdfContent,
  extractTopics,
  extractPersonality,
  extractSummary,
  analyzeUrl,
  synthesizeResults,
} from "@/services/openai";

interface ProfileData {
  topics: string[];
  personality: string[];
  summary: string[];
  isLoading?: boolean;
  error?: string;
}

const ProfileCreator = () => {
  const { toast } = useToast();
  const location = useLocation();

  const [inputUrls, setInputUrls] = useState({
    pdfUrl: "",
    youtubeUrl: "",
    websiteUrl: "",
    linkedinUrl: "",
    bookUrl: "",
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState("input");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [linkedInProfile, setLinkedInProfile] = useState<any>(null);

  // Check if we came from LinkedIn callback
  useEffect(() => {
    const state = location.state as { linkedinConnected?: boolean } | null;
    if (state?.linkedinConnected) {
      // Get LinkedIn profile data from session storage
      const profileData = sessionStorage.getItem("linkedin_profile_data");
      if (profileData) {
        try {
          const parsedData = JSON.parse(profileData);
          setLinkedInProfile(parsedData);
          toast({
            title: "LinkedIn Profile Connected",
            description: "Your LinkedIn profile data has been imported",
          });
        } catch (error) {
          console.error("Error parsing LinkedIn profile data:", error);
        }
      }
    }
  }, [location, toast]);

  const handleInputChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.currentTarget;
    setInputUrls((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (files: File[]) => {
    setPdfFile(files.length > 0 ? files[0] : null);
  };

  const handleLinkedInProfileConnected = (profileData: any) => {
    setLinkedInProfile(profileData);
    // Extract LinkedIn URL if available
    if (profileData?.id) {
      const linkedinUrl = `https://www.linkedin.com/in/${profileData.id}`;
      setInputUrls((prev) => ({
        ...prev,
        linkedinUrl,
      }));
    }
  };

  const handleAnalyze = async () => {
    // Check if any input source is provided
    const hasInput =
      pdfFile ||
      linkedInProfile ||
      inputUrls.youtubeUrl.trim() !== "" ||
      inputUrls.websiteUrl.trim() !== "" ||
      inputUrls.linkedinUrl.trim() !== "" ||
      inputUrls.bookUrl.trim() !== "";

    // If no input is provided, show error toast
    if (!hasInput) {
      toast({
        title: "Input Required",
        description: "Please provide at least one content source to analyze",
        variant: "destructive",
      });
      return;
    }

    // Set loading state
    setIsAnalyzing(true);
    setProfileData({
      topics: [],
      personality: [],
      summary: [""],
      isLoading: true,
    });
    setCurrentStep("profile");

    try {
      const analysisResults: string[] = [];

      // Extract text from PDF if available
      if (pdfFile) {
        try {
          const pdfContent = await extractTextFromPdf(pdfFile);
          const pdfAnalysis = await analyzePdfContent(pdfContent);
          analysisResults.push(pdfAnalysis);
        } catch (error) {
          console.error("Error extracting text from PDF:", error);
          toast({
            title: "PDF Processing Warning",
            description:
              "Had trouble with the PDF. Continuing with other sources.",
            variant: "default",
          });
        }
      }

      // Process LinkedIn data if available
      if (linkedInProfile) {
        try {
          // Create a text representation of the LinkedIn profile
          const linkedInProfileText = `
Name: ${linkedInProfile.firstName} ${linkedInProfile.lastName}
Headline: ${linkedInProfile.headline || ""}
Industry: ${linkedInProfile.industry || ""}
Summary: ${linkedInProfile.summary || ""}
          
Experience:
${
  (linkedInProfile.positions &&
    linkedInProfile.positions
      .map(
        (pos: any) =>
          `- ${pos.title} at ${pos.companyName} (${
            pos.isCurrent ? "Current" : ""
          })`
      )
      .join("\n")) ||
  "No experience data available"
}

Skills:
${
  (linkedInProfile.skills && linkedInProfile.skills.join(", ")) ||
  "No skills data available"
}

Education:
${
  (linkedInProfile.education &&
    linkedInProfile.education
      .map(
        (edu: any) =>
          `- ${edu.degree || ""} in ${edu.fieldOfStudy || ""} at ${
            edu.schoolName
          }`
      )
      .join("\n")) ||
  "No education data available"
}
`;
          const linkedInAnalysis = await analyzePdfContent(linkedInProfileText);
          analysisResults.push(linkedInAnalysis);
        } catch (error) {
          console.error("Error analyzing LinkedIn data:", error);
          toast({
            title: "LinkedIn Analysis Warning",
            description:
              "Had trouble analyzing LinkedIn data. Continuing with other sources.",
            variant: "default",
          });
        }
      }

      // Process all URLs that have values
      const urlTypes = {
        youtubeUrl: "YouTube URL",
        websiteUrl: "website URL",
        linkedinUrl: "LinkedIn URL",
        bookUrl: "published book URL",
      };

      // Process each URL with better error handling
      for (const [key, value] of Object.entries(inputUrls)) {
        if (value.trim() !== "" && key in urlTypes) {
          try {
            // Special handling for LinkedIn URL if not already processed via OAuth
            if (key === "linkedinUrl" && !linkedInProfile) {
              const linkedInAnalysis = await analyzeLinkedInProfile(value);
              analysisResults.push(linkedInAnalysis);
            } else if (key !== "linkedinUrl" || !linkedInProfile) {
              const urlAnalysis = await analyzeUrl(
                value,
                urlTypes[key as keyof typeof urlTypes]
              );
              analysisResults.push(urlAnalysis);
            }
          } catch (error) {
            console.error(`Error analyzing ${key}:`, error);
            // More informative toast
            toast({
              title: `${key} Analysis Warning`,
              description: `Could not analyze the ${key}. Continuing with other sources.`,
              variant: "default",
            });
          }
        }
      }

      // If we have any analysis results, process them
      if (analysisResults.length > 0) {
        let finalProfile: string;

        // If we have multiple sources, synthesize them
        if (analysisResults.length > 1) {
          finalProfile = await synthesizeResults(analysisResults);
        } else {
          // Just use the single result
          finalProfile = analysisResults[0];
        }

        // Extract structured data from the OpenAI response
        const topics = extractTopics(finalProfile);
        const personality = extractPersonality(finalProfile);
        const summary = extractSummary(finalProfile);

        setProfileData({
          summary: summary,
          topics: topics,
          personality: personality,
        });

        toast({
          title: "Analysis Complete",
          description: "Speaker profile has been generated successfully",
        });
      } else {
        // Try using backend API as fallback
        try {
          const formData = new FormData();

          if (pdfFile) {
            formData.append("pdf", pdfFile);
          }

          Object.entries(inputUrls).forEach(([key, value]) => {
            if (value.trim() !== "") {
              formData.append(key, value);
            }
          });

          const response = await axios.post(
            "http://localhost:8000/api/v1/profiles/create",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              timeout: 30000, // 30 second timeout
            }
          );

          setProfileData({
            summary: response.data.summary || ["No summary available"],
            topics: response.data.topics || [],
            personality: response.data.personality || [],
          });

          toast({
            title: "Analysis Complete",
            description: "Speaker profile has been generated using backend API",
          });
        } catch (apiError) {
          console.error("Error using backend API:", apiError);

          // If all methods failed, provide a fallback profile
          setProfileData({
            topics: ["Communication", "Leadership", "Professional Development"],
            personality: ["Engaging", "Knowledgeable", "Experienced"],
            summary: [
              "We couldn't analyze your content in detail. Please try providing different content sources or check your API keys.",
            ],
          });

          toast({
            title: "Analysis Limited",
            description:
              "Could not fully analyze your content. Generated a basic profile.",
            variant: "default",
          });
        }
      }
    } catch (error) {
      console.error("General error during analysis:", error);
      setProfileData({
        topics: ["Communication", "Leadership", "Professional Development"],
        personality: ["Engaging", "Knowledgeable", "Experienced"],
        summary: [
          "We couldn't analyze your content. Please try again with different content sources.",
        ],
        error: "There was an error analyzing your content. Please try again.",
      });

      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your content",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Speaker Profile Creator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Upload content or provide links to generate a comprehensive speaker
          profile. Our AI will analyze your content to identify key topics and
          personality traits.
        </p>
      </div>

      <Tabs
        value={currentStep}
        onValueChange={setCurrentStep}
        className="space-y-6"
      >
        <div className="flex justify-center">
          <TabsList className="grid grid-cols-2 w-[400px]">
            <TabsTrigger value="input">Content Input</TabsTrigger>
            <TabsTrigger value="profile" disabled={!profileData}>
              Speaker Profile
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="input" className="space-y-6 min-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-auto">
            <div className="md:col-span-2">
              <ContentUploader
                icon={<FileText className="h-5 w-5 text-findmystage-green" />}
                title="PDF Documents"
                description="Upload a PDF of a presentation, article, or publication"
                onFileChange={handleFileChange}
                type="pdf"
              />
            </div>

            {/* Add LinkedIn Connect Component */}
            <LinkedInConnect
              onProfileConnected={handleLinkedInProfileConnected}
            />

            <ContentUploader
              icon={<Youtube className="h-5 w-5 text-findmystage-green" />}
              title="YouTube Content"
              description="Link to your YouTube channel or specific videos"
              inputProps={{
                name: "youtubeUrl",
                value: inputUrls.youtubeUrl,
                onChange: handleInputChange,
                placeholder: "Enter YouTube channel or video URL",
              }}
              type="default"
            />

            <ContentUploader
              icon={<Globe className="h-5 w-5 text-findmystage-green" />}
              title="Website"
              description="Link to your personal website or blog"
              inputProps={{
                name: "websiteUrl",
                value: inputUrls.websiteUrl,
                onChange: handleInputChange,
                placeholder: "Enter website URL",
              }}
            />

            <ContentUploader
              icon={<BookOpen className="h-5 w-5 text-findmystage-green" />}
              title="Books"
              description="Link to your published books or articles"
              inputProps={{
                name: "bookUrl",
                value: inputUrls.bookUrl,
                onChange: handleInputChange,
                placeholder: "Enter book URL or ISBN",
              }}
            />
          </div>

          <Alert className="bg-blue-50 dark:bg-blue-950 border-findmystage-blue">
            <AlertCircle className="h-4 w-4 text-findmystage-blue" />
            <AlertTitle>Provide as much content as possible</AlertTitle>
            <AlertDescription>
              The more content you provide, the more accurate your speaker
              profile will be. You don't need to fill all fields, but the AI
              works best with multiple sources.
            </AlertDescription>
          </Alert>

          <div className="flex justify-center mt-8">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              size="lg"
              className="flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Generate Speaker Profile
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="min-h-[60vh]">
          {profileData && <SpeakerProfile data={profileData} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileCreator;
