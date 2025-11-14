'use client';

import React, { useCallback, useState } from 'react';
import { formatFileSize } from '@/lib/pdfUtils';
import type { UploadedPDF } from '@/lib/types';
import { colors } from '@/lib/design-tokens';
import { logger } from '@/lib/logger';
import { config } from '@/lib/config';

interface FileUploadProps {
  onFilesAdded: (files: UploadedPDF[]) => void;
  uploadedFiles: UploadedPDF[];
  onRemoveFile: (id: string) => void;
}

export default function FileUpload({ onFilesAdded, uploadedFiles, onRemoveFile }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  
  const fileUploadLogger = logger.namespace('FileUpload');

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const pdfFiles: UploadedPDF[] = [];
    const invalidFiles: string[] = [];
    
    Array.from(files).forEach(file => {
      if (file.type === 'application/pdf') {
        if (file.size > config.pdf.maxFileSize) {
          fileUploadLogger.warn(config.messages.errors.fileTooLarge, { 
            fileName: file.name, 
            fileSize: file.size,
            maxSize: config.pdf.maxFileSize 
          });
          invalidFiles.push(`${file.name} (exceeds ${formatFileSize(config.pdf.maxFileSize)})`);
          return;
        }
        
        pdfFiles.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          name: file.name,
          size: file.size,
        });
      } else {
        fileUploadLogger.warn(config.messages.errors.invalidFormat, { 
          fileName: file.name, 
          fileType: file.type 
        });
        invalidFiles.push(`${file.name} (not a PDF)`);
      }
    });

    if (invalidFiles.length > 0) {
      fileUploadLogger.info('Some files were rejected', { 
        rejectedCount: invalidFiles.length,
        rejectedFiles: invalidFiles 
      });
    }

    if (pdfFiles.length > 0) {
      if (uploadedFiles.length + pdfFiles.length > config.pdf.maxFiles) {
        fileUploadLogger.warn(config.messages.errors.tooManyFiles, {
          attemptedTotal: uploadedFiles.length + pdfFiles.length,
          maxFiles: config.pdf.maxFiles
        });
        return;
      }
      
      fileUploadLogger.info('Files added', { fileCount: pdfFiles.length });
      onFilesAdded(pdfFiles);
    }
  }, [onFilesAdded, uploadedFiles.length, fileUploadLogger]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 animate-scale-in
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 scale-105 shadow-2xl' 
            : 'border-gray-300 bg-white/50 hover:border-blue-400 hover:bg-white/70 hover:shadow-xl'
          }
        `}
      >
        {/* Decorative elements */}
        <div className="absolute top-4 left-4 w-20 h-20 rounded-full blur-3xl opacity-50" style={{ background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary})` }}></div>
        <div className="absolute bottom-4 right-4 w-32 h-32 rounded-full blur-3xl opacity-50" style={{ background: `linear-gradient(to top left, ${colors.secondary}, ${colors.accent})` }}></div>
        
        <div className="relative flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-xl opacity-50" style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})` }}></div>
            <div className="relative p-6 rounded-full" style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})` }}>
              <svg 
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
            </div>
          </div>
          
          <div>
            <p className="text-xl font-semibold text-gray-800 mb-2">
              Drop your PDF files here
            </p>
            <p className="text-sm text-gray-500">
              or click below to browse your files
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Support for multiple PDF files
            </p>
          </div>

          <label className="cursor-pointer group">
            <input
              type="file"
              multiple
              accept=".pdf,application/pdf"
              onChange={handleFileInput}
              className="hidden"
            />
            <span className="inline-flex items-center gap-2 px-8 py-4 text-white rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105 font-medium" style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})` }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Choose PDF Files
            </span>
          </label>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Uploaded Files
            </h3>
            <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
              {uploadedFiles.length} {uploadedFiles.length === 1 ? 'file' : 'files'}
            </span>
          </div>
          <div className="space-y-3">
            {uploadedFiles.map((file, index) => (
              <div
                key={file.id}
                className="group flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-100 rounded-lg blur-sm"></div>
                    <div className="relative bg-gradient-to-br from-red-500 to-pink-500 p-2 rounded-lg">
                      <svg 
                        className="w-5 h-5 text-white flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span>{formatFileSize(file.size)}</span>
                      {file.pageCount && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {file.pageCount} {file.pageCount === 1 ? 'page' : 'pages'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveFile(file.id)}
                  className="ml-3 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 flex-shrink-0"
                  title="Remove file"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
