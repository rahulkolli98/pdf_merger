'use client';

import React, { useState, useCallback } from 'react';
import FileUpload from '@/components/FileUpload';
import PDFPreview from '@/components/PDFPreview';
import MergeControls from '@/components/MergeControls';
import { loadPDFFile, mergePDFPages, downloadPDF } from '@/lib/pdfUtils';
import type { UploadedPDF, PDFPage, MergeProgress } from '@/lib/types';

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedPDF[]>([]);
  const [pages, setPages] = useState<PDFPage[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<MergeProgress>({
    status: 'idle',
    message: '',
    progress: 0,
  });

  // Handle new files uploaded
  const handleFilesAdded = useCallback(async (newFiles: UploadedPDF[]) => {
    setIsLoading(true);
    setProgress({ status: 'loading', message: 'Loading PDFs...', progress: 0 });

    try {
      const newPages: PDFPage[] = [];

      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];
        const filePages = await loadPDFFile(file.file, file.id);
        newPages.push(...filePages);

        // Update file with page count
        newFiles[i].pageCount = filePages.length;

        setProgress({
          status: 'loading',
          message: `Loading PDF ${i + 1} of ${newFiles.length}...`,
          progress: ((i + 1) / newFiles.length) * 100,
        });
      }

      setUploadedFiles(prev => [...prev, ...newFiles]);
      setPages(prev => [...prev, ...newPages]);
      setProgress({ status: 'idle', message: '', progress: 0 });
    } catch (error) {
      console.error('Error loading PDFs:', error);
      setProgress({
        status: 'error',
        message: 'Failed to load PDFs. Please try again.',
        progress: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle file removal
  const handleRemoveFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    setPages(prev => prev.filter(p => p.sourceFileId !== fileId));
    setSelectedPages(prev => {
      const updated = new Set(prev);
      pages.forEach(p => {
        if (p.sourceFileId === fileId) {
          updated.delete(p.id);
        }
      });
      return updated;
    });
  }, [pages]);

  // Handle page reordering
  const handleReorder = useCallback((reorderedPages: PDFPage[]) => {
    setPages(reorderedPages);
  }, []);

  // Handle page deletion
  const handleDeletePage = useCallback((pageId: string) => {
    setPages(prev => prev.filter(p => p.id !== pageId));
    setSelectedPages(prev => {
      const updated = new Set(prev);
      updated.delete(pageId);
      return updated;
    });
  }, []);

  // Handle page selection toggle
  const handleToggleSelect = useCallback((pageId: string) => {
    setSelectedPages(prev => {
      const updated = new Set(prev);
      if (updated.has(pageId)) {
        updated.delete(pageId);
      } else {
        updated.add(pageId);
      }
      return updated;
    });
  }, []);

  // Handle selected pages deletion
  const handleDeleteSelected = useCallback(() => {
    setPages(prev => prev.filter(p => !selectedPages.has(p.id)));
    setSelectedPages(new Set());
  }, [selectedPages]);

  // Handle merge and download
  const handleMerge = useCallback(async (filename: string) => {
    if (pages.length === 0) return;

    setProgress({ status: 'processing', message: 'Merging PDFs...', progress: 0 });

    try {
      // Create a map of file IDs to File objects
      const fileMap = new Map<string, File>();
      uploadedFiles.forEach(uf => {
        fileMap.set(uf.id, uf.file);
      });

      // Merge the PDFs
      const mergedPdfBytes = await mergePDFPages(pages, fileMap);

      setProgress({ status: 'processing', message: 'Preparing download...', progress: 90 });

      // Download the merged PDF
      downloadPDF(mergedPdfBytes, filename);

      setProgress({
        status: 'complete',
        message: 'PDF merged and downloaded successfully!',
        progress: 100,
      });

      // Reset success message after 3 seconds
      setTimeout(() => {
        setProgress({ status: 'idle', message: '', progress: 0 });
      }, 3000);
    } catch (error) {
      console.error('Error merging PDFs:', error);
      setProgress({
        status: 'error',
        message: 'Failed to merge PDFs. Please try again.',
        progress: 0,
      });

      // Reset error message after 5 seconds
      setTimeout(() => {
        setProgress({ status: 'idle', message: '', progress: 0 });
      }, 5000);
    }
  }, [pages, uploadedFiles]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <svg 
              className="w-10 h-10 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">PDF Merger</h1>
              <p className="text-sm text-gray-600 mt-1">
                Upload, preview, reorder, and merge your PDFs
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        <div className="space-y-8">
          {/* File Upload Section */}
          <section>
            <FileUpload
              onFilesAdded={handleFilesAdded}
              uploadedFiles={uploadedFiles}
              onRemoveFile={handleRemoveFile}
            />
          </section>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">{progress.message}</p>
            </div>
          )}

          {/* PDF Preview Section */}
          {!isLoading && pages.length > 0 && (
            <section>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Preview & Edit Pages
                </h2>
                <PDFPreview
                  pages={pages}
                  onReorder={handleReorder}
                  onDeletePage={handleDeletePage}
                  selectedPages={selectedPages}
                  onToggleSelect={handleToggleSelect}
                  onDeleteSelected={handleDeleteSelected}
                />
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Merge Controls - Fixed at bottom */}
      {pages.length > 0 && (
        <MergeControls
          onMerge={handleMerge}
          pageCount={pages.length}
          disabled={pages.length === 0 || isLoading}
          progress={progress}
        />
      )}
    </div>
  );
}
