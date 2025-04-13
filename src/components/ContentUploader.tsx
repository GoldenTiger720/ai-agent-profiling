import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PDFUploader from "./PDFUploader";

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
  type?: "pdf" | "default";
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
