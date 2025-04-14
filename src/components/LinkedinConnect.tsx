import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Linkedin, LogOut, UserCheck } from "lucide-react";
import { getLinkedInAuthUrl } from "@/services/linkedinService";

interface LinkedInConnectProps {
  onProfileConnected?: (profileData: any) => void;
}

const LinkedInConnect: React.FC<LinkedInConnectProps> = ({
  onProfileConnected,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    // Check if we have LinkedIn data in session storage
    const storedAccessToken = sessionStorage.getItem("linkedin_access_token");
    const storedTokenExpiry = sessionStorage.getItem("linkedin_token_expiry");
    const storedProfileData = sessionStorage.getItem("linkedin_profile_data");

    if (storedAccessToken && storedTokenExpiry && storedProfileData) {
      // Check if token is still valid
      const expiryTime = parseInt(storedTokenExpiry, 10);
      if (Date.now() < expiryTime) {
        setIsConnected(true);
        const parsedData = JSON.parse(storedProfileData);
        setProfileData(parsedData);

        // Notify parent component if callback provided
        if (onProfileConnected) {
          onProfileConnected(parsedData);
        }
      } else {
        // Token expired, clean up
        disconnectLinkedIn();
      }
    }
  }, [onProfileConnected]);

  const connectLinkedIn = () => {
    // Redirect to LinkedIn authorization URL
    window.location.href = getLinkedInAuthUrl();
  };

  const disconnectLinkedIn = () => {
    // Clear LinkedIn data from session storage
    sessionStorage.removeItem("linkedin_access_token");
    sessionStorage.removeItem("linkedin_token_expiry");
    sessionStorage.removeItem("linkedin_profile_data");

    setIsConnected(false);
    setProfileData(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Linkedin className="h-5 w-5 text-findmystage-blue" />
          <CardTitle className="text-base">LinkedIn Profile</CardTitle>
        </div>
        <CardDescription>
          Connect your LinkedIn profile to import your professional data
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isConnected && profileData ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {profileData.profilePicture ? (
                <img
                  src={profileData.profilePicture}
                  alt={`${profileData.firstName} ${profileData.lastName}`}
                  className="h-12 w-12 rounded-full object-cover border"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div>
                <p className="font-medium">
                  {profileData.firstName} {profileData.lastName}
                </p>
                {profileData.headline && (
                  <p className="text-sm text-muted-foreground">
                    {profileData.headline}
                  </p>
                )}
              </div>
            </div>
            {profileData.industry && (
              <p className="text-sm">
                <span className="font-medium">Industry:</span>{" "}
                {profileData.industry}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Connect your LinkedIn profile to automatically import your
            professional background, experience, and skills to create a more
            accurate speaker profile.
          </p>
        )}
      </CardContent>
      <CardFooter>
        {isConnected ? (
          <Button
            variant="outline"
            className="w-full text-destructive hover:text-destructive"
            onClick={disconnectLinkedIn}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect LinkedIn
          </Button>
        ) : (
          <Button
            className="w-full bg-[#0A66C2] hover:bg-[#0A66C2]/90"
            onClick={connectLinkedIn}
          >
            <Linkedin className="h-4 w-4 mr-2" />
            Connect with LinkedIn
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default LinkedInConnect;
