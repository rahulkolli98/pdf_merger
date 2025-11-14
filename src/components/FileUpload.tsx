'use client';

import React, { useCallback, useState } from 'react';
import { formatFileSize } from '@/lib/pdfUtils';
import type { UploadedPDF } from '@/lib/types';

interface FileUploadProps {
  onFilesAdded: (files: UploadedPDF[]) => void;
  uploadedFiles: UploadedPDF[];
  onRemoveFile: (id: string) => void;
}

export default function FileUpload({ onFilesAdded, uploadedFiles, onRemoveFile }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const pdfFiles: UploadedPDF[] = [];
    
    Array.from(files).forEach(file => {
      if (file.type === 'application/pdf') {
        pdfFiles.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          name: file.name,
          size: file.size,
        });
      }
    });

    if (pdfFiles.length > 0) {
      onFilesAdded(pdfFiles);
    }
  }, [onFilesAdded]);

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
          border-2 border-dashed rounded-lg p-12 text-center transition-all
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
      >
        <div className="flex flex-col items-center gap-4">
          <svg 
            className="w-16 h-16 text-gray-400"
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
          
          <div>
            <p className="text-lg font-medium text-gray-700">
              Drag & drop PDF files here
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or click the button below to select files
            </p>
          </div>

          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              accept=".pdf,application/pdf"
              onChange={handleFileInput}
              className="hidden"
            />
            <span className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Select PDF Files
            </span>
          </label>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">
            Uploaded Files ({uploadedFiles.length})
          </h3>
          <div className="space-y-2">
            {uploadedFiles.map(file => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <svg 
                    className="w-8 h-8 text-red-600 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)}
                      {file.pageCount && ` • ${file.pageCount} pages`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveFile(file.id)}
                  className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
