// TypeScript interfaces and types for the PDF merger application

export interface UploadedPDF {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount?: number;
}

export interface PDFPage {
  id: string;
  pageNumber: number;
  sourceFileId: string;
  sourceFileName: string;
  thumbnail?: string;
  width: number;
  height: number;
}

export interface MergeProgress {
  status: 'idle' | 'loading' | 'processing' | 'complete' | 'error';
  message: string;
  progress: number;
}
