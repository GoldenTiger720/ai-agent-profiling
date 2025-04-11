
import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2 } from "lucide-react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Set up the worker for PDF.js

interface PDFPreviewProps {
  file: File | null;
  previewUrl: string | null;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ file, previewUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set the worker source
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    
    // Reset state when a new file is loaded
    setIsLoading(true);
    setError(null);
    setNumPages(null);
  }, [file, previewUrl]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const onDocumentLoadError = (err: Error) => {
    console.error("Error loading PDF:", err);
    setError("Failed to load PDF");
    setIsLoading(false);
  };

  if (!file || !previewUrl) {
    return null;
  }

  return (
    <div className="pdf-preview border rounded-md overflow-hidden shadow-sm">
      <div className="bg-muted p-2 text-xs font-medium">
        PDF Preview - {file.name}
      </div>
      <div className="flex justify-center items-center p-4 bg-muted/20 h-[500px] overflow-auto">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
            <p className="text-sm text-muted-foreground">Loading preview...</p>
          </div>
        )}
        <Document
          file={previewUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
        >
          {!isLoading && !error && (
            <Page
              pageNumber={1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              scale={0.8}
              className="pdf-page"
            />
          )}
        </Document>
        {error && (
          <div className="text-center py-8">
            <p className="text-destructive">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Unable to preview this PDF file
            </p>
          </div>
        )}
      </div>
      {numPages && numPages > 1 && (
        <div className="bg-muted p-2 text-xs text-center text-muted-foreground">
          Showing page 1 of {numPages}
        </div>
      )}
    </div>
  );
};

export default PDFPreview;
