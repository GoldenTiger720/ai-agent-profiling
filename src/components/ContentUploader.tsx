
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';

interface ContentUploaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onFileChange?: (file: File | null) => void;
  inputProps?: {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
  };
}

const ContentUploader: React.FC<ContentUploaderProps> = ({
  icon,
  title,
  description,
  onFileChange,
  inputProps
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onFileChange) {
      onFileChange(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="input-section border-dashed">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        
        {onFileChange && (
          <div className="flex flex-col items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              className="hidden"
              accept=".pdf"
            />
            <Button
              variant="outline"
              onClick={triggerFileInput}
              className="w-full text-sm h-auto py-2 border-dashed"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </div>
        )}
        
        {inputProps && (
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
