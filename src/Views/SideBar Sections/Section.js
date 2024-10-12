import React, { useContext, useState, useRef, useEffect } from 'react';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import SectionItem from './SectionItem';
import { SectionsListContext } from '../../Context/SectionsListContext';
import { PlusCircle } from 'lucide-react';

const Popover = ({ isOpen, onClose, availableSections, onAddSection }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <div className="py-1">
                {availableSections.map((section) => (
                    <button
                        key={section.name}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        onClick={() => onAddSection(section)}
                    >
                        {section.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

const Section = ({ sections, currentSection, setCurrentSection, setReorderedSections }) => {
    const {sectionsList,mandatorySections} = useContext(SectionsListContext);
    const allAvailableSections = sectionsList;
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const popoverRef = useRef(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        console.log('Current Section was changed', currentSection);
    }, [currentSection]);

    useEffect(() => {
        console.log("Sections updated:", sections);
      }, [sections]);

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id && over.id >= 2) {
            const oldIndex = sections.findIndex(section => section.id === active.id);
            const newIndex = sections.findIndex(section => section.id === over.id);

            const newSections = arrayMove(sections, oldIndex, newIndex);

            const updatedSections = newSections.map((section, index) => ({
                ...section,
                id: index
            }));

            setReorderedSections(updatedSections);
            setCurrentSection(newIndex);

            
        }
    };

    const handleAddSection = (newSection) => {
        const updatedSections = [...sections, { ...newSection, id: sections.length, isActive: true }];
        setReorderedSections(updatedSections);
        setCurrentSection(updatedSections.length - 1);
        setIsPopoverOpen(false);
    };

    const handleDeleteSection = (sectionId) => {
        const updatedSections = sections.filter((section) => section.id !== sectionId);
        // Update the id of each section
        updatedSections.forEach((section, index) => {
            section.id = index;
        });

        setReorderedSections(updatedSections);
        console.log(updatedSections);
        console.log(sections);
        setLastSection();
    }


    //a funcion that sets the current section to the last section
    const setLastSection = () => {
        setCurrentSection(sections.length - 1);
    };


    const availableSectionsToAdd = allAvailableSections.filter(
        section => !sections.some(s => s.name === section.name)
    );



    return (
        <div className="w-full space-y-2 relative">
            <nav className="rounded-lg shadow-md p-2 min-h-96 max-h-[calc(100vh-4rem)] overflow-y-auto bg-white w-full">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                >
                    <SortableContext items={sections.map((section) => section.id)} strategy={verticalListSortingStrategy}>
                        <ul className="space-y-2">
                            {sections.map((section, index) => (
                                <SectionItem
                                    key={section.id}
                                    section={section}
                                    currentSection={currentSection}
                                    setCurrentSection={() => setCurrentSection(index)}
                                    isActive={section.isActive !== false}
                                    handleDeleteSection={handleDeleteSection}
                                />
                            ))}
                        </ul>
                    </SortableContext>
                </DndContext>
            </nav>
            
            <div className="relative" ref={popoverRef}>
                <button
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                >
                    <PlusCircle className="h-6 w-6 text-indigo-600" />
                </button>
                
                <Popover
                    isOpen={isPopoverOpen}
                    onClose={() => setIsPopoverOpen(false)}
                    availableSections={availableSectionsToAdd}
                    onAddSection={handleAddSection}
                />
            </div>
        </div>
    );
};

export default Section;