import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableItem({ id, section, isActive, onClick, isCollapsed }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        cursor-pointer p-2 rounded-lg transition-all duration-200
        ${isActive ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}
      `}
      onClick={onClick}
    >
      <div className="flex items-center">
        <span className="text-xl mr-2">{section.emoji}</span>
        {!isCollapsed && <span>{section.name}</span>}
      </div>
    </div>
  );
}