'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { PDFPage } from '@/lib/types';

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative group bg-white rounded-lg shadow-md overflow-hidden
        transition-all duration-200
        ${isSelected ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'}
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
      `}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 p-1.5 bg-white/90 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        title="Drag to reorder"
      >
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>

      {/* Select Checkbox */}
      <div className="absolute top-2 right-2 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(page.id)}
          className="w-5 h-5 rounded cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(page.id)}
        className="absolute top-10 right-2 z-10 p-1.5 bg-red-500 text-white rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        title="Delete page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
      <div className="p-3 bg-gray-50 border-t">
        <p className="text-sm font-medium text-gray-900 truncate">
          Page {index + 1}
        </p>
        <p className="text-xs text-gray-500 truncate" title={page.sourceFileName}>
          {page.sourceFileName}
        </p>
      </div>
    </div>
  );
}
