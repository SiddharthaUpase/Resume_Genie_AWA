import React from 'react';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import SectionItem from './SectionItem';

const Section = ({ sections, currentSection, setCurrentSection, setReorderedSections }) => {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id && over.id >= 2) {
            console.log(active.id, over.id);
            const oldIndex = sections.findIndex(section => section.id === active.id);
            const newIndex = sections.findIndex(section => section.id === over.id);

            const newSections = arrayMove(sections, oldIndex, newIndex);

            // Update section IDs to match their new positions
            const updatedSections = newSections.map((section, index) => ({
                ...section,
                id: index
            }));



            setReorderedSections(updatedSections);
            setCurrentSection(newIndex);
        }
    };

    return (
        <nav className="md:w-full rounded-lg shadow-md p-2 space-y-2 h-96">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
            >
                <SortableContext items={sections.map((section) => section.id)} strategy={verticalListSortingStrategy}>
                    <ul className="space-y-2">
                        {sections.map((section) => (
                            <SectionItem
                                key={section.id}
                                section={section}
                                currentSection={currentSection}
                                setCurrentSection={setCurrentSection}
                            />
                        ))}
                    </ul>
                </SortableContext>
            </DndContext>
        </nav>
    );
};

export default Section;