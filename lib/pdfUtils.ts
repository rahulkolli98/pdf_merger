// PDF manipulation utilities
import { PDFDocument } from 'pdf-lib';
import type { PDFPage, UploadedPDF } from './types';
import { logger } from './logger';
import { config } from './config';

const pdfLogger = logger.namespace('PDFUtils');

// Dynamic import for pdfjs-dist to avoid server-side issues
let pdfjsLib: any = null;

// Initialize PDF.js only on client side
if (typeof window !== 'undefined') {
  import('pdfjs-dist').then((pdfjs) => {
    pdfjsLib = pdfjs;
    // Use unpkg CDN which is more reliable
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    pdfLogger.debug('PDF.js initialized', { version: pdfjsLib.version });
  }).catch((error) => {
    pdfLogger.error('Failed to initialize PDF.js', error);
  });
}

/**
 * Load a PDF file and extract page information
 */
export async function loadPDFFile(file: File, fileId: string): Promise<PDFPage[]> {
  pdfLogger.debug('Loading PDF file', { fileName: file.name, fileSize: file.size });
  
  // Ensure pdfjs is loaded
  if (!pdfjsLib) {
    pdfLogger.info('PDF.js not loaded, loading now');
    const pdfjs = await import('pdfjs-dist');
    pdfjsLib = pdfjs;
    // Use unpkg CDN which is more reliable
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    pdfLogger.info('PDF loaded successfully', { 
      fileName: file.name, 
      pageCount: pdf.numPages 
    });
    
    const pages: PDFPage[] = [];
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1 });
      
      // Render page to canvas for thumbnail
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        pdfLogger.warn('Failed to get canvas context for page', { pageNumber: i });
        continue;
      }
      
      const scale = config.ui.thumbnailWidth / viewport.width;
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
    
    pdfLogger.debug('Generated thumbnails for all pages', { 
      fileName: file.name, 
      pageCount: pages.length 
    });
    
    return pages;
  } catch (error) {
    pdfLogger.error(config.messages.errors.loadFailed, error, { fileName: file.name });
    throw error;
  }
}

/**
 * Merge selected pages into a single PDF
 */
export async function mergePDFPages(
  pages: PDFPage[],
  uploadedFiles: Map<string, File>
): Promise<Uint8Array> {
  pdfLogger.info('Starting PDF merge', { pageCount: pages.length });
  
  try {
    const mergedPdf = await PDFDocument.create();
    
    // Load all source PDFs into a cache
    const loadedPdfs = new Map<string, PDFDocument>();
    
    for (const page of pages) {
      // Load the source PDF if not already loaded
      if (!loadedPdfs.has(page.sourceFileId)) {
        const file = uploadedFiles.get(page.sourceFileId);
        if (!file) {
          pdfLogger.warn('Source file not found', { 
            sourceFileId: page.sourceFileId,
            pageId: page.id 
          });
          continue;
        }
        
        pdfLogger.debug('Loading source PDF', { fileName: file.name });
        const arrayBuffer = await file.arrayBuffer();
        const sourcePdf = await PDFDocument.load(arrayBuffer);
        loadedPdfs.set(page.sourceFileId, sourcePdf);
      }
      
      // Get the source PDF
      const sourcePdf = loadedPdfs.get(page.sourceFileId);
      if (!sourcePdf) {
        pdfLogger.warn('Failed to load source PDF', { sourceFileId: page.sourceFileId });
        continue;
      }
      
      // Copy the page (page numbers are 1-indexed, array is 0-indexed)
      const [copiedPage] = await mergedPdf.copyPages(sourcePdf, [page.pageNumber - 1]);
      
      // Add the page to the end (maintains order)
      mergedPdf.addPage(copiedPage);
    }
    
    const pdfBytes = await mergedPdf.save();
    
    pdfLogger.info('PDF merge completed', { 
      pageCount: pages.length,
      outputSize: pdfBytes.length 
    });
    
    return pdfBytes;
  } catch (error) {
    pdfLogger.error(config.messages.errors.mergeFailed, error);
    throw error;
  }
}

/**
 * Download a PDF file
 */
export function downloadPDF(pdfBytes: Uint8Array, filename: string = config.pdf.defaultFileName) {
  pdfLogger.info('Initiating PDF download', { 
    fileName: filename, 
    fileSize: pdfBytes.length 
  });
  
  try {
    const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    // Clean up
    setTimeout(() => {
      URL.revokeObjectURL(url);
      pdfLogger.debug('Cleaned up blob URL');
    }, 100);
    
    pdfLogger.info('PDF download initiated successfully');
  } catch (error) {
    pdfLogger.error('Failed to download PDF', error);
    throw error;
  }
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
