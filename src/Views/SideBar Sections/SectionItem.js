import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SectionItem = ({ section, currentSection, setCurrentSection }) => {

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const isSelected = currentSection === section.id;

    return (
        <li 
            ref={setNodeRef} 
            style={style} 
            {...attributes} 
            className={`rounded-lg overflow-hidden ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        >
            <div 
                className={`flex items-center space-x-2 w- p-2 transition-colors duration-200 ${
                    isSelected ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'
                }`}
            >
                <span className="cursor-pointer" onClick={() => setCurrentSection(section.id)}>
                    {section.emoji}
                </span>
                <span 
                    className="flex-grow cursor-pointer"
                    onClick={() => setCurrentSection(section.id)}
                >
                    {section.name}
                </span>

                {section.name !== 'Socials' && section.name !== 'Personal Info' && (
                    <span 
                        className="cursor-grab" 
                        {...listeners}
                    >
                        &#x2630; {/* Unicode for a draggable icon */}
                    </span>
                )}
            </div>
        </li>
    );
};

export default SectionItem;