import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getAccessToken,
  getBasicProfile,
  LinkedInProfileData,
} from "@/services/linkedinService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LinkedInCallback: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<LinkedInProfileData | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    async function processOAuthCallback() {
      // Get the authorization code from URL parameters
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");
      const error = urlParams.get("error");
      const errorDescription = urlParams.get("error_description");

      try {
        if (error) {
          throw new Error(`LinkedIn auth error: ${error}. ${errorDescription}`);
        }

        if (!code) {
          throw new Error("No authorization code received from LinkedIn");
        }

        // Exchange the code for an access token
        const tokenResponse = await getAccessToken(code);

        // Store token in session storage (not local storage for security)
        // In a production app, consider more secure token storage methods
        sessionStorage.setItem(
          "linkedin_access_token",
          tokenResponse.access_token
        );
        sessionStorage.setItem(
          "linkedin_token_expiry",
          (Date.now() + tokenResponse.expires_in * 1000).toString()
        );

        // Fetch basic profile information
        const profileData = await getBasicProfile(tokenResponse.access_token);
        setProfile(profileData);

        // Store the profile data for use in profile creator
        sessionStorage.setItem(
          "linkedin_profile_data",
          JSON.stringify(profileData)
        );

        toast({
          title: "LinkedIn Connected",
          description: "Your LinkedIn profile has been successfully connected",
        });

        setLoading(false);
      } catch (err) {
        console.error("LinkedIn OAuth error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to connect with LinkedIn"
        );
        setLoading(false);

        toast({
          title: "LinkedIn Connection Failed",
          description:
            err instanceof Error
              ? err.message
              : "An error occurred connecting to LinkedIn",
          variant: "destructive",
        });
      }
    }

    processOAuthCallback();
  }, [location, toast]);

  const handleContinue = () => {
    navigate("/profile", { state: { linkedinConnected: true } });
  };

  const handleRetry = () => {
    navigate("/profile");
  };

  return (
    <div className="container mx-auto max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">LinkedIn Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-6">
              <Loader2 className="h-12 w-12 text-findmystage-blue animate-spin mb-4" />
              <p className="text-center text-lg">
                Processing your LinkedIn authentication...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-6">
              <XCircle className="h-12 w-12 text-destructive mb-4" />
              <p className="text-center text-destructive mb-4">{error}</p>
              <Button onClick={handleRetry} variant="outline">
                Try Again
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <CheckCircle className="h-12 w-12 text-findmystage-green mb-4" />
              <p className="text-center text-lg mb-2">
                Successfully connected with LinkedIn!
              </p>
              {profile && (
                <div className="text-center mb-6">
                  <p className="font-medium text-xl">
                    Welcome, {profile.firstName} {profile.lastName}
                  </p>
                  {profile.headline && (
                    <p className="text-muted-foreground">{profile.headline}</p>
                  )}
                </div>
              )}
              <Button onClick={handleContinue}>
                Continue to Profile Creator
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkedInCallback;
