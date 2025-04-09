import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, Youtube } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface YouTubePreviewProps {
  url: string;
  onChange: (url: string) => void;
}

const YouTubePreview: React.FC<YouTubePreviewProps> = ({ url, onChange }) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showEmbed, setShowEmbed] = useState(false);

  useEffect(() => {
    if (!url) {
      setVideoId(null);
      setError(null);
      setShowEmbed(false);
      return;
    }

    try {
      let extractedId: string | null = null;

      // Handle youtu.be format
      if (url.includes("youtu.be")) {
        const match = url.match(/youtu\.be\/([^?&]+)/);
        if (match && match[1]) extractedId = match[1];
      }
      // Handle youtube.com format
      else if (url.includes("youtube.com")) {
        const urlObj = new URL(url);
        extractedId = urlObj.searchParams.get("v");
      }

      if (extractedId) {
        setVideoId(extractedId);
        setError(null);
      } else {
        setVideoId(null);
        setError("Invalid YouTube URL format");
      }
    } catch (e) {
      setVideoId(null);
      setError("Invalid URL");
    }
  }, [url]);

  const handleThumbnailClick = () => {
    setShowEmbed(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Youtube className="h-5 w-5 text-findmystage-green" />
        <Input
          value={url}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter YouTube video URL"
          className="flex-1"
        />
      </div>

      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {videoId && !showEmbed && (
        <Card
          className="overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          onClick={handleThumbnailClick}
        >
          <CardContent className="p-0">
            <div className="aspect-video w-full relative">
              <img
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt="YouTube Thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center opacity-80">
                  <div className="w-0 h-0 border-y-8 border-y-transparent border-l-12 border-l-white ml-1"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {videoId && showEmbed && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default YouTubePreview;
