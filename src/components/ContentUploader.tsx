
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PDFUploader from "./PDFUploader";
import YouTubePreview from "./YouTubePreview";

interface ContentUploaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onFileChange?: (files: File[]) => void;
  inputProps?: {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
  };
  type?: "pdf" | "youtube" | "default";
}

const ContentUploader: React.FC<ContentUploaderProps> = ({
  icon,
  title,
  description,
  onFileChange,
  inputProps,
  type = "default",
}) => {
  const handleFilesUploaded = (files: File[]) => {
    if (onFileChange) {
      onFileChange(files);
    }
  };

  const handleYouTubeChange = (url: string) => {
    if (inputProps?.onChange) {
      const event = {
        target: { name: inputProps.name, value: url },
      } as React.ChangeEvent<HTMLInputElement>;

      inputProps.onChange(event);
    }
  };

  return (
    <Card className="input-section border-dashed h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>

        {type === "pdf" && onFileChange && (
          <PDFUploader onFilesUploaded={handleFilesUploaded} />
        )}

        {type === "youtube" && inputProps && (
          <YouTubePreview
            url={inputProps.value}
            onChange={handleYouTubeChange}
          />
        )}

        {type === "default" && inputProps && (
          <Input
            name={inputProps.name}
            value={inputProps.value}
            onChange={inputProps.onChange}
            placeholder={inputProps.placeholder}
            className="text-sm"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ContentUploader;
