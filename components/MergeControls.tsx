'use client';

import React, { useState } from 'react';
import type { MergeProgress } from '@/lib/types';
import { colors } from '@/lib/design-tokens';
import { config } from '@/lib/config';

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
  const [filename, setFilename] = useState<string>(config.pdf.defaultFileName);
  const [isCustomFilename, setIsCustomFilename] = useState(false);

  const handleMerge = async () => {
    await onMerge(filename);
  };

  return (
    <div className="sticky bottom-0 glass border-t border-white/20 shadow-2xl p-4 md:p-6 animate-slide-up backdrop-blur-xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Progress/Status */}
          {progress.status !== 'idle' && (
            <div className="flex items-center justify-center gap-2">
              {progress.status === 'processing' && (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-blue-600"></div>
                  <span className="text-xs sm:text-sm text-gray-600">{progress.message}</span>
                </div>
              )}
              {progress.status === 'complete' && (
                <div className="flex items-center gap-2" style={{ color: colors.success }}>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs sm:text-sm">{progress.message}</span>
                </div>
              )}
              {progress.status === 'error' && (
                <div className="flex items-center gap-2" style={{ color: colors.error }}>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-xs sm:text-sm">{progress.message}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            {/* Filename Input */}
            <div className="flex-1">
              {isCustomFilename ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter filename"
                  />
                  <button
                    onClick={() => setIsCustomFilename(false)}
                    className="px-2 py-2 text-gray-600 hover:text-gray-800"
                    title="Use default filename"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsCustomFilename(true)}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 underline text-left w-full sm:w-auto truncate"
                >
                  Custom filename: {filename}
                </button>
              )}
            </div>

            {/* Merge Button */}
            <button
              onClick={handleMerge}
              disabled={disabled || progress.status === 'processing'}
              className={`
                relative px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base overflow-hidden group
                ${disabled || progress.status === 'processing'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'text-white shadow-xl hover:shadow-2xl hover:scale-105'
                }
              `}
              style={!disabled && progress.status !== 'processing' ? {
                background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`
              } : undefined}
            >
              {/* Shimmer effect */}
              {!disabled && progress.status !== 'processing' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              )}
              
              <span className="relative flex items-center justify-center gap-2">
                {progress.status === 'processing' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span className="hidden sm:inline">Processing...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="hidden sm:inline">Merge & Download</span>
                    <span className="sm:hidden">Merge</span>
                    {pageCount > 0 && (
                      <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                        {pageCount}
                      </span>
                    )}
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
