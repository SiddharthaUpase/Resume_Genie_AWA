import React ,{useContext,useState} from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ProgressInfoContext} from '../../Context/ProgressInfoContext'; 

const SectionItem = ({ section, currentSection, setCurrentSection, handleDeleteSection }) => {

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const isSelected = currentSection === section.id;

    const { progressInfo, setProgressInfo } = useContext(ProgressInfoContext);

    //temporary implemantation only
    const filledStatusArray = Object.values(progressInfo.filledStatus);

    const [showDelete, setShowDelete] = useState(false);


    const handleDelete = () => {
        handleDeleteSection(section.id);
        setShowDelete(false);
    }


    return (
        <li 
            ref={setNodeRef} 
            style={style} 
            {...attributes} 
            className={`rounded-lg overflow-hidden ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setCurrentSection(section.id)}
        >
            <div 
                className={`flex items-center space-x-2 p-2 transition-colors duration-200 ${
                    isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                }`}
            >
                {!showDelete ? (
                    <>
                        <span 
                            className={`cursor-pointer`} 
                            
                        >
                            {section.emoji}
                        </span>
                        <span 
                            className={`flex-grow cursor-pointer`}
                            onClick={() => setCurrentSection(section.id)}
                        >
                            {section.name}
                        </span>
                        {(section.name === 'Achievements' || section.name === 'Leadership' || section.name === 'Extracurriculars' || section.name === 'Summary' || section.name === 'Certifications' || section.isCustom) && (
                            <span 
                                className="cursor-pointer text-red-500 hover:bg-red-200"
                                onClick={() => setShowDelete(true)} // Wrap the state update in a function
                            >
                                🗑️
                            </span>
                        )}
                        {section.name !== 'Socials' && section.name !== 'Personal Info' && (
                            <span 
                                className="cursor-grab" 
                                {...listeners}
                            >
                                &#x2630; {/* Unicode for a draggable icon */}
                            </span>
                        )}
                    </>
                ) : (
                    <div className="flex items-center space-x-2  p-2 transition-colors duration-200 bg-red-500 text-white">
                        <span>Are you sure?</span>
                        <span 
                            className="cursor-pointer"
                             onClick={handleDelete} // Call the function here
                        >
                            Yes
                        </span>
                        <span 
                            className="cursor-pointer"
                            onClick={() => setShowDelete(false)}
                        >
                            No
                        </span>
                    </div>
                )}
            </div>
        </li>
    )
};

export default SectionItem;