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
import PageThumbnail from './PageThumbnail';
import type { PDFPage } from '@/lib/types';

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
      <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-gray-700">
            {pages.length} page{pages.length !== 1 ? 's' : ''}
          </p>
          {selectedPages.size > 0 && (
            <p className="text-sm text-blue-600">
              {selectedPages.size} selected
            </p>
          )}
        </div>

        {selectedPages.size > 0 && (
          <button
            onClick={onDeleteSelected}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Delete Selected ({selectedPages.size})
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
