'use client';

import React, { useState } from 'react';
import type { MergeProgress } from '@/lib/types';

interface MergeControlsProps {
  onMerge: (filename: string) => Promise<void>;
  pageCount: number;
  disabled: boolean;
  progress: MergeProgress;
}

export default function MergeControls({
  onMerge,
  pageCount,
  disabled,
  progress,
}: MergeControlsProps) {
  const [filename, setFilename] = useState('merged-document.pdf');
  const [isCustomFilename, setIsCustomFilename] = useState(false);

  const handleMerge = async () => {
    await onMerge(filename);
  };

  return (
    <div className="sticky bottom-0 bg-white border-t shadow-lg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Filename Input */}
          <div className="flex-1 w-full sm:w-auto">
            {isCustomFilename ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter filename"
                />
                <button
                  onClick={() => setIsCustomFilename(false)}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  title="Use default filename"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsCustomFilename(true)}
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Custom filename: {filename}
              </button>
            )}
          </div>

          {/* Progress/Status */}
          {progress.status !== 'idle' && (
            <div className="flex items-center gap-2">
              {progress.status === 'processing' && (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-600">{progress.message}</span>
                </div>
              )}
              {progress.status === 'complete' && (
                <div className="flex items-center gap-2 text-green-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">{progress.message}</span>
                </div>
              )}
              {progress.status === 'error' && (
                <div className="flex items-center gap-2 text-red-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-sm">{progress.message}</span>
                </div>
              )}
            </div>
          )}

          {/* Merge Button */}
          <button
            onClick={handleMerge}
            disabled={disabled || progress.status === 'processing'}
            className={`
              px-8 py-3 rounded-lg font-medium transition-all
              ${disabled || progress.status === 'processing'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
              }
            `}
          >
            {progress.status === 'processing' ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </span>
            ) : (
              <>
                Merge & Download
                {pageCount > 0 && ` (${pageCount} page${pageCount !== 1 ? 's' : ''})`}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
