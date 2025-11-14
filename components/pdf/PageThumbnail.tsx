'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { PDFPage } from '@/lib/types';
import { colors } from '@/lib/design-tokens';

interface PageThumbnailProps {
  page: PDFPage;
  index: number;
  onDelete: (pageId: string) => void;
  isSelected: boolean;
  onToggleSelect: (pageId: string) => void;
}

export default function PageThumbnail({ 
  page, 
  index, 
  onDelete, 
  isSelected, 
  onToggleSelect 
}: PageThumbnailProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const cardStyle = {
    ...style,
    ...(isSelected && {
      outline: `2px solid ${colors.error}`,
      boxShadow: `0 10px 25px -5px ${colors.error}40`,
    }),
  };

  return (
    <div
      ref={setNodeRef}
      style={cardStyle}
      className={`
        relative group bg-white rounded-xl shadow-sm overflow-hidden
        transition-all duration-300 animate-scale-in
        ${isSelected 
          ? 'shadow-lg' 
          : 'hover:shadow-xl hover:scale-105 hover:-translate-y-1'
        }
        ${isDragging ? 'cursor-grabbing scale-105 shadow-2xl' : 'cursor-grab'}
      `}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 p-1.5 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-grab active:cursor-grabbing hover:scale-110"
        title="Drag to reorder"
        style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})` }}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8h16M4 16h16" />
        </svg>
      </div>

      {/* Select Checkbox */}
      <div className="absolute top-2 right-2 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(page.id)}
          className="w-5 h-5 rounded-md cursor-pointer border-2 border-gray-300 checked:bg-red-500 checked:border-red-500 transition-all duration-200"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(page.id)}
        className="absolute top-10 right-2 z-10 p-1.5 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        title="Delete page"
        style={{ background: `linear-gradient(to right, ${colors.error}, #DC2626)` }}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      {/* Thumbnail Image */}
      {page.thumbnail && (
        <img
          src={page.thumbnail}
          alt={`Page ${page.pageNumber}`}
          className="w-full h-auto"
        />
      )}

      {/* Page Info */}
      <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold text-gray-800">
            Page {index + 1}
          </p>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})` }}></div>
        </div>
        <p className="text-[10px] text-gray-500 truncate" title={page.sourceFileName}>
          {page.sourceFileName}
        </p>
      </div>
    </div>
  );
}
