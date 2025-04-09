
import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, File, Upload, X, Check, Copy } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

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
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
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

  const processFiles = useCallback((files: FileList) => {
    const validFiles: File[] = [];
    const newPdfFiles: PDFFile[] = [];

    Array.from(files).forEach(file => {
      if (file.type === 'application/pdf') {
        validFiles.push(file);
        newPdfFiles.push({
          file,
          id: Math.random().toString(36).substr(2, 9),
          preview: URL.createObjectURL(file),
          progress: 0,
          uploading: false,
          uploaded: false,
          error: null,
          content: null
        });
      } else {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a PDF file`,
          variant: "destructive"
        });
      }
    });

    if (validFiles.length > 0) {
      setPdfFiles(prev => [...prev, ...newPdfFiles]);
      onFilesUploaded(validFiles);
    }
  }, [onFilesUploaded, toast]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  }, [processFiles]);

  const handleButtonClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const uploadFile = useCallback(async (fileId: string) => {
    const fileToUpload = pdfFiles.find(f => f.id === fileId);
    if (!fileToUpload || fileToUpload.uploading || fileToUpload.uploaded) return;

    setPdfFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, uploading: true, error: null } : f
    ));

    const formData = new FormData();
    formData.append('file', fileToUpload.file);

    try {
      const response = await axios.post('http://localhost:8000/api/v1/uploads/pdf', formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setPdfFiles(prev => prev.map(f => 
              f.id === fileId ? { ...f, progress: percentCompleted } : f
            ));
          }
        }
      });

      setPdfFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          uploading: false, 
          uploaded: true, 
          content: response.data?.content || null,
          progress: 100
        } : f
      ));

      toast({
        title: "Upload successful",
        description: `${fileToUpload.file.name} has been uploaded successfully`,
      });
    } catch (error) {
      setPdfFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          uploading: false, 
          error: "Failed to upload file",
          progress: 0
        } : f
      ));

      toast({
        title: "Upload failed",
        description: `Failed to upload ${fileToUpload.file.name}`,
        variant: "destructive"
      });
    }
  }, [pdfFiles, toast]);

  const removeFile = useCallback((fileId: string) => {
    setPdfFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  }, []);

  const copyContent = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Content copied",
      description: "File content has been copied to clipboard",
    });
  }, [toast]);

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
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
          multiple
        />
        <File className="h-12 w-12 mx-auto text-findmystage-green mb-4" />
        <h3 className="text-lg font-medium mb-2">Drag and drop PDF files here</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Or click the button below to browse for files
        </p>
        <Button onClick={handleButtonClick} className="gap-2">
          <Upload className="h-4 w-4" />
          Select PDF Files
        </Button>
      </div>

      {pdfFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">PDF Files ({pdfFiles.length})</h3>
          {pdfFiles.map((pdf) => (
            <Card key={pdf.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <File className="h-5 w-5 text-findmystage-green" />
                      <span className="font-medium truncate max-w-[200px]">{pdf.file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({Math.round(pdf.file.size / 1024)} KB)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {!pdf.uploaded && !pdf.uploading && (
                        <Button 
                          size="sm" 
                          onClick={() => uploadFile(pdf.id)}
                          variant="outline" 
                          className="gap-1"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          Upload
                        </Button>
                      )}
                      {pdf.uploaded && (
                        <span className="text-xs flex items-center text-green-600 gap-1">
                          <Check className="h-3.5 w-3.5" /> Uploaded
                        </span>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => removeFile(pdf.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {pdf.uploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Uploading...</span>
                        <span>{pdf.progress}%</span>
                      </div>
                      <Progress value={pdf.progress} className="h-2" />
                    </div>
                  )}

                  {pdf.error && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{pdf.error}</AlertDescription>
                    </Alert>
                  )}

                  {pdf.content && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Content Preview</h4>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => copyContent(pdf.content || '')}
                          className="h-6 gap-1"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </Button>
                      </div>
                      <Textarea
                        value={pdf.content}
                        readOnly
                        className="h-24 text-xs"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PDFUploader;
