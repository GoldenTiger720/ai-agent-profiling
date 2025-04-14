import { pdfjs } from "react-pdf";

// Make sure the worker is set
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    // Create array buffer from file
    const arrayBuffer = await file.arrayBuffer();

    // Load the PDF document
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

    // Extract text from each page
    let fullText = "";

    // Limit to first 10 pages for performance if PDF is very large
    const pagesToExtract = Math.min(pdf.numPages, 10);

    for (let i = 1; i <= pagesToExtract; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");

        fullText += pageText + "\n\n";
      } catch (pageError) {
        console.error(`Error extracting text from page ${i}:`, pageError);
        continue; // Skip problematic pages
      }
    }

    // If we couldn't extract any text, throw an error
    if (!fullText.trim()) {
      throw new Error("No text content could be extracted from the PDF");
    }

    return fullText;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error(
      "Failed to extract text from PDF: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}
