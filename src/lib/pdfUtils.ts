// PDF manipulation utilities
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFPage, UploadedPDF } from './types';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

/**
 * Load a PDF file and extract page information
 */
export async function loadPDFFile(file: File, fileId: string): Promise<PDFPage[]> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  const pages: PDFPage[] = [];
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1 });
    
    // Render page to canvas for thumbnail
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) continue;
    
    const scale = 0.5; // Thumbnail scale
    const thumbnailViewport = page.getViewport({ scale });
    
    canvas.width = thumbnailViewport.width;
    canvas.height = thumbnailViewport.height;
    
    await page.render({
      canvasContext: context,
      viewport: thumbnailViewport,
    }).promise;
    
    pages.push({
      id: `${fileId}-page-${i}`,
      pageNumber: i,
      sourceFileId: fileId,
      sourceFileName: file.name,
      thumbnail: canvas.toDataURL('image/png'),
      width: viewport.width,
      height: viewport.height,
    });
  }
  
  return pages;
}

/**
 * Merge selected pages into a single PDF
 */
export async function mergePDFPages(
  pages: PDFPage[],
  uploadedFiles: Map<string, File>
): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();
  
  // Group pages by source file for efficient loading
  const pagesByFile = new Map<string, PDFPage[]>();
  
  pages.forEach(page => {
    const existing = pagesByFile.get(page.sourceFileId) || [];
    existing.push(page);
    pagesByFile.set(page.sourceFileId, existing);
  });
  
  // Load each source file and copy pages
  for (const [fileId, pagesFromFile] of pagesByFile.entries()) {
    const file = uploadedFiles.get(fileId);
    if (!file) continue;
    
    const arrayBuffer = await file.arrayBuffer();
    const sourcePdf = await PDFDocument.load(arrayBuffer);
    
    for (const page of pagesFromFile) {
      // Find the position of this page in the final merge order
      const targetIndex = pages.findIndex(p => p.id === page.id);
      
      // Copy the page (page numbers are 1-indexed, array is 0-indexed)
      const [copiedPage] = await mergedPdf.copyPages(sourcePdf, [page.pageNumber - 1]);
      
      // Insert at the correct position
      mergedPdf.insertPage(targetIndex, copiedPage);
    }
  }
  
  return await mergedPdf.save();
}

/**
 * Download a PDF file
 */
export function downloadPDF(pdfBytes: Uint8Array, filename: string = 'merged.pdf') {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  
  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Get file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
