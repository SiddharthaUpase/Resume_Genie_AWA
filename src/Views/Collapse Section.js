import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './Sortable Item';

const CollapsibleSection = ({ 
  sections, 
  currentSection, 
  setCurrentSection, 
  setReorderedSections 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = sections.findIndex(section => section.id === active.id);
      const newIndex = sections.findIndex(section => section.id === over.id);
      
      const newSections = [...sections];
      const [movedSection] = newSections.splice(oldIndex, 1);
      newSections.splice(newIndex, 0, movedSection);
      
      setReorderedSections(newSections);
    }
  };

  return (
    <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'w-12' : 'w-64'}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`font-bold text-lg ${isCollapsed ? 'hidden' : 'block'}`}>Sections</h2>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sections} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {sections.map((section) => (
              <SortableItem
                key={section.id}
                id={section.id}
                section={section}
                isActive={currentSection === section.id}
                onClick={() => setCurrentSection(section.id)}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default CollapsibleSection;