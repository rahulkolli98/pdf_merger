'use client';

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { PageThumbnail } from './';
import type { PDFPage } from '@/lib/types';
import { colors } from '@/lib/design-tokens';

interface PDFPreviewProps {
  pages: PDFPage[];
  onReorder: (pages: PDFPage[]) => void;
  onDeletePage: (pageId: string) => void;
  selectedPages: Set<string>;
  onToggleSelect: (pageId: string) => void;
  onDeleteSelected: () => void;
}

export default function PDFPreview({
  pages,
  onReorder,
  onDeletePage,
  selectedPages,
  onToggleSelect,
  onDeleteSelected,
}: PDFPreviewProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = pages.findIndex((page) => page.id === active.id);
      const newIndex = pages.findIndex((page) => page.id === over.id);

      onReorder(arrayMove(pages, oldIndex, newIndex));
    }
  };

  if (pages.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto w-24 h-24 text-gray-300"
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
        <p className="mt-4 text-lg text-gray-500">No pages to preview</p>
        <p className="text-sm text-gray-400">Upload PDF files to get started</p>
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 p-4 rounded-xl border" style={{ background: `linear-gradient(to right, ${colors.primary}10, ${colors.secondary}10)`, borderColor: `${colors.primary}30` }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.success }}></div>
            <p className="text-sm font-semibold text-gray-800">
              {pages.length} page{pages.length !== 1 ? 's' : ''}
            </p>
          </div>
          {selectedPages.size > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg" style={{ backgroundColor: `${colors.error}15` }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.error }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm font-medium" style={{ color: colors.error }}>
                {selectedPages.size} marked for deletion
              </p>
            </div>
          )}
        </div>

        {selectedPages.size > 0 && (
          <button
            onClick={onDeleteSelected}
            className="w-full sm:w-auto px-5 py-2.5 text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2 group"
            style={{ background: `linear-gradient(to right, ${colors.error}, #DC2626)` }}
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete {selectedPages.size} Page{selectedPages.size !== 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* Pages Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={pages.map(p => p.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {pages.map((page, index) => (
              <PageThumbnail
                key={page.id}
                page={page}
                index={index}
                onDelete={onDeletePage}
                isSelected={selectedPages.has(page.id)}
                onToggleSelect={onToggleSelect}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
