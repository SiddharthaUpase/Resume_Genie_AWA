import React, { useContext, useState, useRef, useEffect } from 'react';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import SectionItem from './SectionItem';
import { SectionsListContext } from '../../Context/SectionsListContext';
import { CirclePlus } from 'lucide-react';

const Popover = ({ isOpen, onClose, availableSections, onAddSection }) => {
    if (!isOpen) return null;

    return (
       <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
    <div className="py-1">
        {availableSections.map((section) => (
            <button
                key={section.name}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                onClick={() => {
                    onAddSection(section);
                    setIsPopoverOpen(false); // Close the popover after adding the section
                }}
            >
                {section.name}
            </button>
        ))}
    </div>
</div>

    );
};

const Section = ({ sections, currentSection, setCurrentSection, setReorderedSections, deleteCustomSection, handleAddCustomSection}) => {
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

        if(newSection.name == 'Custom Section')
        {
         const sectionName = prompt("Please enter the name of the custom section");

         if(sectionName == null || sectionName == "") return;
        const tempSectionName = sectionName.trim();

        // if (['Achievements', 'Certifications', 'Leadership', 'Extracurriculars', 'Summary'].includes(tempSectionName)) {
        //     alert("This section name is reserved and cannot be used.");
        //     return;
        // }
        //check if the section name exuist in the customasections 
        if (sections.some((section) => section.name === sectionName)) {
            alert("This section already exists");
            return;
        }

        handleAddCustomSection(sectionName);
        setIsPopoverOpen(false);

    }else{


        const updatedSections = [...sections, { ...newSection, id: sections.length, isActive: true }];
        setReorderedSections(updatedSections);
        setCurrentSection(updatedSections.length - 1);
        setIsPopoverOpen(false);

    }
    };

    const handleDeleteSection = (sectionId) => {

        //go through the sections and check if the object with this id is a custom section

        const sectionToDelete = sections.find((section) => section.id === sectionId);
        if (sectionToDelete.isCustom) {
            deleteCustomSection(sectionToDelete.id);
            console.log("Custom section deleted");
        }
        else {



        const updatedSections = sections.filter((section) => section.id !== sectionId);
        // Update the id of each section
        updatedSections.forEach((section, index) => {
            section.id = index;
        });

        setReorderedSections(updatedSections);
        setLastSection();
    }

        

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
                    <CirclePlus className="h-6 w-6 text-lightBlue-500" />
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
