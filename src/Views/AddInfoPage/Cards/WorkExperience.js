import currentApiUrl from "../../../Models/apiUrl";
import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown, ChevronUp, Wand, X } from 'lucide-react';
import { rewriteDescription, rewriteSpecificLine, addPointToDescription } from '../../../Models/addInfoModels';
import { Plus, Trash2, Edit2, GripVertical, Pencil,Wand2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { p } from "framer-motion/client";
import AIEnhancedEditor from "../../../Custom Components/AIEnhancedEditor";

const WorkExperienceForm = ({ workExperience, onChange }) => {
  const [experiences, setExperiences] = useState(() => {
    if (workExperience && workExperience.length > 0) {
      return workExperience;
    } else {
      return [];
    }
  });

  const [expandedSections, setExpandedSections] = useState({});
  const [activeTab, setActiveTab] = useState('aiRewrite');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);


  useEffect(() => {
    onChange(experiences);
  }, [experiences, onChange]);

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleAddExperience = () => {
    if (experiences.length < 4) {
      const newIndex = experiences.length;
      setExperiences([...experiences, { company: '', jobTitle: '', startDate: '', endDate: '', location: '', description: '' }]);
      setExpandedSections(prev => ({
        ...prev,
        [newIndex]: true
      }));
    }
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newExperiences = experiences.map((exp, i) =>
      i === index ? { ...exp, [name]: value } : exp
    );
    setExperiences(newExperiences);
  };

  const handleQuillChange = (index, content) => {
    const newExperiences = experiences.map((exp, i) =>
      i === index ? { ...exp, description: content } : exp
    );
    setExperiences(newExperiences);
  };

  const handleDeleteExperience = (index) => {
    const newExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(newExperiences);
  };

  const handleAIrewrite = async (index, prompt) => {
    setIsGenerating(true);
    try {
      
      //make an API call to the server
      const response = await fetch(`${currentApiUrl}/rephrase_work_description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: experiences[index].description,
          prompt: prompt

        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const rephrase_work_description = data.rephrased_description;
      const newExperiences = experiences.map((exp, i) =>
        i === index ? { ...exp, description: rephrase_work_description } : exp
      );
      
      setExperiences(newExperiences);
      onChange(newExperiences);
      
      

    } catch (error) {
      console.error('Error rewriting description:', error);
    } finally {
      
      setIsGenerating(false);
    }
  };


  const handleAddPoint = async (index) => {
    setIsGenerating(true);
    try {
      const response = await addPointToDescription(experiences[index].description, customPrompt);
      //add the response to the html description  
      const newExperiences = experiences.map((exp, i) =>
        i === index ? { ...exp, description: exp.description + response } : exp
      );
      setExperiences(newExperiences);
      onChange(newExperiences);
      console.log(newExperiences);


    } catch (error) {
      console.error('Error adding point to description:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const displayMonthYear = (date) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    return `${year}-${month}`;
  }
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
  };


  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const items = [...experiences];
    const draggedItemContent = items[draggedItem];
    items.splice(draggedItem, 1);
    items.splice(index, 0, draggedItemContent);

    setDraggedItem(index);
    setExperiences(items);
  };


  // Custom CSS to target the ReactQuill editor
  const quillStyles = `
  .quill-custom .ql-container {
      min-height: 150px;
      border: 1px solid #d1d5db;
      msx-height: 400px;
      overflow-y: auto;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      
  }
  .quill-custom .ql-toolbar {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
  }
`;

  return (
    <div className="flex flex-col items-start space-y-4 max-w-3xl mx-auto bg-white">
      <style>{quillStyles}</style>
      {experiences.map((exp, index) => (
        <div key={index} className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <div
            className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
            onClick={() => toggleSection(index)}
          >
            <div className="flex items-center space-x-2">
              <div draggable={true}
              
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}


              >
                <GripVertical className="w-5 h-5 cursor-grab" />
              </div>
              {expandedSections[index] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              <h3 className="font-medium">
                {exp.company || exp.jobTitle ?
                  `${exp.company}${exp.jobTitle ? ` - ${exp.jobTitle}` : ''}` :
                  `Work Experience ${index + 1}`
                }
              </h3>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteExperience(index);
              }}
              className="text-red-500 hover:text-red-700 focus:outline-none"
              aria-label="Delete work experience entry"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {expandedSections[index] && (
               <div className="p-4 space-y-4">
              <div>
                <label htmlFor={`company-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Company</label>

                <input
                  type="text"
                  id={`company-${index}`}
                  name="company"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                />
              </div>

              <div>
                <label htmlFor={`jobTitle-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Job Title</label>
                <input
                  type="text"
                  id={`jobTitle-${index}`}
                  name="jobTitle"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Job Title"
                  value={exp.jobTitle}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`startDate-0`} className="block mb-2 text-sm font-medium text-gray-900">
                    Start Month
                  </label>
                  <input
                    type="month"
                    id={`startMonth-0`}
                    name="startMonth"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={displayMonthYear(exp.startMonth)}
                    onChange={(e) => {
                      handleInputChange(index, e);
                      console.log(e.target.value);
                    }}
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor={`endDate-0`} className="block mb-2 text-sm font-medium text-gray-900">
                    End Month
                  </label>
                  <input
                    type="month"
                    id={`endMonth-0`}
                    name="endMonth"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={displayMonthYear(exp.endMonth)}
                    onChange={(e) => handleInputChange(index, e)}
                    disabled={experiences[index].endMonth === "Present"}
                    required
                  />
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id={`present-0`}
                      name="present"
                      className="mr-2"
                      checked={experiences[index].endMonth === "Present"}
                      onChange={(e) => {
                        const newExperiences = [...experiences];
                        newExperiences[index].endMonth = e.target.checked ? "Present" : "";
                        setExperiences(newExperiences);
                      }}
                    />
                    <label htmlFor={`present-0`} className="text-sm font-medium text-gray-900">
                      Present
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor={`location-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Location</label>
                <input

                  type="text"
                  id={`location-${index}`}
                  name="location"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Location"
                  value={exp.location}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                />
              </div>
              <AIEnhancedEditor
                                index={index}
                                content={exp.description}
                                onContentChange={handleQuillChange}
                                label='Description'
                                linecount={4}
                                characterLimit={200}
                                isDescriptionEmpty={exp.description === ''}
                                apiEndpoint = 'rephrase_work_description'
                                contentType="Work"
                            />
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleAddExperience}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
        disabled={experiences.length >= 4}
      >
        Add Experience
      </button>
    </div>
  );
};

export default WorkExperienceForm;