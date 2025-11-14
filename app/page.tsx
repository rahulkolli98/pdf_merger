'use client';

import React, { useState, useCallback } from 'react';
import { FileUpload, PDFPreview, MergeControls } from '@/components/pdf';
import { loadPDFFile, mergePDFPages, downloadPDF } from '@/lib/pdfUtils';
import type { UploadedPDF, PDFPage, MergeProgress } from '@/lib/types';
import { colors } from '@/lib/design-tokens';
import { logger } from '@/lib/logger';
import { config } from '@/lib/config';

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

  const pageLogger = logger.namespace('Home');

  // Handle new files uploaded
  const handleFilesAdded = useCallback(async (newFiles: UploadedPDF[]) => {
    setIsLoading(true);
    setProgress({ status: 'loading', message: 'Loading PDFs...', progress: 0 });

    pageLogger.info('Starting to load PDF files', { fileCount: newFiles.length });

    try {
      const newPages: PDFPage[] = [];

      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];
        pageLogger.debug('Loading PDF file', { fileName: file.name, fileSize: file.size });
        
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
      
      pageLogger.info('Successfully loaded all PDF files', { 
        totalFiles: newFiles.length, 
        totalPages: newPages.length 
      });
    } catch (error) {
      pageLogger.error(config.messages.errors.loadFailed, error);
      setProgress({
        status: 'error',
        message: config.messages.errors.loadFailed,
        progress: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, [pageLogger]);

  // Handle file removal
  const handleRemoveFile = useCallback((fileId: string) => {
    pageLogger.info('Removing file', { fileId });
    
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
  }, [pages, pageLogger]);

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
    
    pageLogger.info('Starting PDF merge', { 
      pageCount: pages.length, 
      fileName: filename 
    });

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
        message: config.messages.success.merged,
        progress: 100,
      });
      
      pageLogger.info('PDF merge completed successfully', { 
        fileName: filename,
        outputSize: mergedPdfBytes.length 
      });

      // Reset success message after 3 seconds
      setTimeout(() => {
        setProgress({ status: 'idle', message: '', progress: 0 });
      }, 3000);
    } catch (error) {
      pageLogger.error(config.messages.errors.mergeFailed, error);
      setProgress({
        status: 'error',
        message: config.messages.errors.mergeFailed,
        progress: 0,
      });

      // Reset error message after 5 seconds
      setTimeout(() => {
        setProgress({ status: 'idle', message: '', progress: 0 });
      }, 5000);
    }
  }, [pages, uploadedFiles, pageLogger]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-gray-50">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-5">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl blur-xl opacity-40" style={{ backgroundColor: colors.primary }}></div>
                <div className="relative p-3 rounded-2xl shadow-lg" style={{ backgroundColor: colors.primary }}>
                  <svg 
                    className="w-7 h-7 text-white"
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
                </div>
              </div>
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: colors.primary }}>
                  {config.app.name}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                  Merge PDFs in seconds • 100% Free
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {pages.length === 0 && !isLoading && (
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-16 text-center animate-fade-in">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6" style={{ color: colors.textPrimary }}>
            Merge PDF Files
            <br />
            <span style={{ color: colors.primary }}>
              In Seconds
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
            Combine multiple PDFs into one document. Upload, reorder, delete pages, and download.
          </p>
          <p className="text-sm text-gray-500">
            All processing happens in your browser • Your files never leave your device
          </p>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-12 pb-40">
        <div className="space-y-12">
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
            <div className="text-center py-12 animate-fade-in">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute w-16 h-16 rounded-full blur-xl opacity-50" style={{ backgroundColor: colors.primary }}></div>
                <div 
                  className="relative inline-block animate-spin rounded-full h-12 w-12 border-4 border-transparent"
                  style={{ 
                    borderTopColor: colors.primary,
                    borderRightColor: colors.accent
                  }}
                ></div>
              </div>
              <p className="mt-6 text-gray-700 font-medium">{progress.message}</p>
              {progress.progress > 0 && (
                <div className="mt-4 max-w-xs mx-auto">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full transition-all duration-300 rounded-full"
                      style={{ 
                        width: `${progress.progress}%`,
                        backgroundColor: colors.primary
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PDF Preview Section */}
          {!isLoading && pages.length > 0 && (
            <section className="animate-fade-in">
              <div className="glass rounded-3xl shadow-2xl border border-gray-200/50 p-8 sm:p-10">
                <div className="text-center mb-10">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: colors.primary }}>
                    Preview & Edit Pages
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600">
                    Drag to reorder • Click trash to delete • Select multiple with checkboxes
                  </p>
                </div>
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

      {/* Features Section - Only shown when no files uploaded */}
      {pages.length === 0 && !isLoading && (
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 pb-16 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-3xl text-center hover:shadow-2xl transition-all duration-300 group border border-gray-200/50">
              <div 
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 group-hover:scale-110 transition-transform shadow-lg"
                style={{ backgroundColor: colors.primary }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Upload PDFs</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Drag & drop or click to upload multiple PDF files instantly</p>
            </div>
            
            <div className="glass p-8 rounded-3xl text-center hover:shadow-2xl transition-all duration-300 group border border-gray-200/50">
              <div 
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 group-hover:scale-110 transition-transform shadow-lg"
                style={{ backgroundColor: colors.secondary }}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.textPrimary }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Arrange Pages</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Reorder and delete pages to create your perfect document</p>
            </div>
            
            <div className="glass p-8 rounded-3xl text-center hover:shadow-2xl transition-all duration-300 group border border-gray-200/50">
              <div 
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 group-hover:scale-110 transition-transform shadow-lg"
                style={{ backgroundColor: colors.accent }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Download</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Get your merged PDF file instantly with one click</p>
            </div>
          </div>
        </div>
      )}

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
