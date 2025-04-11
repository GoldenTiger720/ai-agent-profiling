
import React, { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  File,
  Upload,
  X,
  Check,
  Copy,
  FileType,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import PDFPreview from "./PDFPreview";

interface PDFFile {
  file: File;
  id: string;
  preview: string | null;
  progress: number;
  uploading: boolean;
  uploaded: boolean;
  error: string | null;
  content: string | null;
}

interface PDFUploaderProps {
  onFilesUploaded: (files: File[]) => void;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onFilesUploaded }) => {
  const [pdfFile, setPdfFile] = useState<PDFFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = useCallback(
    (file: File) => {
      if (file.type === "application/pdf") {
        // Revoke previous object URL to prevent memory leaks
        if (pdfFile && pdfFile.preview) {
          URL.revokeObjectURL(pdfFile.preview);
        }
        
        const newPdfFile: PDFFile = {
          file,
          id: Math.random().toString(36).substr(2, 9),
          preview: URL.createObjectURL(file),
          progress: 0,
          uploading: false,
          uploaded: false,
          error: null,
          content: null,
        };
        
        setPdfFile(newPdfFile);
        onFilesUploaded([file]); // Pass the single file to the parent
      } else {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a PDF file`,
          variant: "destructive",
        });
      }
    },
    [pdfFile, onFilesUploaded, toast]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        // Take only the first file
        processFile(e.dataTransfer.files[0]);
      }
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        // Take only the first file
        processFile(e.target.files[0]);
      }
    },
    [processFile]
  );

  const handleButtonClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const uploadFile = useCallback(async () => {
    if (!pdfFile || pdfFile.uploading || pdfFile.uploaded) return;

    setPdfFile((prev) => 
      prev ? { ...prev, uploading: true, error: null } : null
    );

    const formData = new FormData();
    formData.append("file", pdfFile.file);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/uploads/pdf",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setPdfFile((prev) => 
                prev ? { ...prev, progress: percentCompleted } : null
              );
            }
          },
        }
      );

      setPdfFile((prev) => 
        prev ? {
          ...prev,
          uploading: false,
          uploaded: true,
          content: response.data?.content || null,
          progress: 100,
        } : null
      );

      toast({
        title: "Upload successful",
        description: `${pdfFile.file.name} has been uploaded successfully`,
      });
    } catch (error) {
      setPdfFile((prev) => 
        prev ? {
          ...prev,
          uploading: false,
          error: "Failed to upload file",
          progress: 0,
        } : null
      );

      toast({
        title: "Upload failed",
        description: `Failed to upload ${pdfFile.file.name}`,
        variant: "destructive",
      });
    }
  }, [pdfFile, toast]);

  const removeFile = useCallback(() => {
    if (pdfFile?.preview) {
      URL.revokeObjectURL(pdfFile.preview);
    }
    setPdfFile(null);
    onFilesUploaded([]); // Clear files in parent component
  }, [pdfFile, onFilesUploaded]);

  const copyContent = useCallback(
    (content: string) => {
      navigator.clipboard.writeText(content);
      toast({
        title: "Content copied",
        description: "File content has been copied to clipboard",
      });
    },
    [toast]
  );

  return (
    <div className="flex flex-col space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? "border-primary bg-primary/5" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf"
          // Changed to single selection
        />
        <File className="h-12 w-12 mx-auto text-findmystage-green mb-4" />
        <h3 className="text-lg font-medium mb-2">
          Drag and drop a PDF file here
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Or click the button below to browse for a file
        </p>
        <Button onClick={handleButtonClick} className="gap-2">
          <Upload className="h-4 w-4" />
          Select PDF File
        </Button>
      </div>

      {pdfFile && (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/2 space-y-4">
            <h3 className="text-lg font-medium">
              Selected PDF File
            </h3>
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileType className="h-5 w-5 text-findmystage-green" />
                      <span className="font-medium truncate max-w-[200px]">
                        {pdfFile.file.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({Math.round(pdfFile.file.size / 1024)} KB)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {!pdfFile.uploaded && !pdfFile.uploading && (
                        <Button
                          size="sm"
                          onClick={uploadFile}
                          variant="outline"
                          className="gap-1"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          Upload
                        </Button>
                      )}
                      {pdfFile.uploaded && (
                        <span className="text-xs flex items-center text-green-600 gap-1">
                          <Check className="h-3.5 w-3.5" /> Uploaded
                        </span>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={removeFile}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {pdfFile.uploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Uploading...</span>
                        <span>{pdfFile.progress}%</span>
                      </div>
                      <Progress value={pdfFile.progress} className="h-2" />
                    </div>
                  )}

                  {pdfFile.error && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{pdfFile.error}</AlertDescription>
                    </Alert>
                  )}

                  {pdfFile.content && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">
                          Content Preview
                        </h4>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyContent(pdfFile.content || "")}
                          className="h-6 gap-1"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </Button>
                      </div>
                      <Textarea
                        value={pdfFile.content}
                        readOnly
                        className="h-24 text-xs"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:w-1/2">
            {pdfFile && (
              <div className="sticky top-4">
                <PDFPreview
                  file={pdfFile.file}
                  previewUrl={pdfFile.preview}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFUploader;
