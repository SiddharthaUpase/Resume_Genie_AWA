import currentApiUrl from "../../Models/apiUrl";
import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Wand2, X,GripVertical } from 'lucide-react';
import { rewriteDescription, addPointToDescription } from '../../Models/addInfoModels';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AIEnhancedEditor from "../../Custom Components/AIEnhancedEditor";

const ProjectForm = ({ projects_data, onChange }) => {
  const [projects, setProjects] = useState(() => {
    if (projects_data && projects_data.length > 0) {
      return projects_data;
    } else {
      return [];
    }
  });

  const [expandedSections, setExpandedSections] = useState({});
  const [activeTab, setActiveTab] = useState('aiRewrite');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [isDescriptionGenerated, setIsDescriptionGenerated] = useState(false);

  useEffect(() => {
    onChange(projects);
  }, [projects, onChange]);

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleAddProject = () => {
    if (projects.length < 4) {
      const newIndex = projects.length;
      setProjects([...projects, { title: '', description: '', link: '', startMonth: '', endMonth: '' }]);
      setExpandedSections(prev => ({
        ...prev,
        [newIndex]: true
      }));
    }
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newProjects = projects.map((proj, i) =>
      i === index ? { ...proj, [name]: value } : proj
    );
    setProjects(newProjects);
  };

  const handleQuillChange = (index, content) => {
    const newProjects = projects.map((proj, i) =>
      i === index ? { ...proj, description: content } : proj
    );
    setProjects(newProjects);
  };

  const handleDeleteProject = (index) => {
    const newProjects = projects.filter((_, i) => i !== index);
    setProjects(newProjects);
  };

  const handleAIrewrite = async (index, prompt,lineCount,charCount) => {

    setIsGenerating(true);
    try {
      
      //make an API call to the server
      const response = await fetch(`${currentApiUrl}/rephrase_work_description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: projects[index].description,
          prompt: prompt,
          lines_count: lineCount,
          chracter_limit: charCount

        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const rephrase_work_description = data.rephrased_description;
      const newProjects = projects.map((exp, i) =>
        i === index ? { ...exp, description: rephrase_work_description } : exp
      );
      
      setProjects(newProjects);
      onChange(newProjects);
      isDescriptionGenerated(true);
      
      

    } catch (error) {
      console.error('Error rewriting description:', error);
    } finally {
      
      setIsGenerating(false);
    }
  };

  const handleAddPoint = async (index,customPrompt) => {
    setIsGenerating(true);
    try {
      const response = await addPointToDescription(projects[index].description, customPrompt);

      const newProjects = projects.map((proj, i) =>
        i === index ? { ...proj, description: proj.description + response } : proj
      );
      setProjects(newProjects);
      onChange(newProjects);
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

    const items = [...projects];
    const draggedItemContent = items[draggedItem];
    items.splice(draggedItem, 1);
    items.splice(index, 0, draggedItemContent);

    setDraggedItem(index);
    setProjects(items);
  };

  const quillStyles = `
    .quill-custom .ql-container {
      min-height: 150px;
      border: 1px solid #d1d5db;
      max-height: 400px;
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
      {projects.map((proj, index) => (
        <div key={index} className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <div
            className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
            onClick={() => toggleSection(index)}
          >
            <div className="flex items-center space-x-2">
              <div draggable="true"
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
                className="cursor-move"
              
              
              >
                <GripVertical className="w-5 h-5" />
              </div>
              {expandedSections[index] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              <h3 className="font-medium">
                {proj.title || proj.link ?
                  `${proj.title}${proj.link ? ` - ${proj.link}` : ''}` :
                  `Project ${index + 1}`
                }
              </h3>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteProject(index);
              }}
              className="text-red-500 hover:text-red-700 focus:outline-none"
              aria-label="Delete project entry"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {expandedSections[index] && (
            <div className="p-4 space-y-4">
              <div>
                <label htmlFor={`title-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Project Title</label>
                <input
                  type="text"
                  id={`title-${index}`}
                  name="title"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Project Title"
                  value={proj.title}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                />
              </div>

              <div>
                <label htmlFor={`link-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Project Link</label>
                <input
                  type="url"
                  id={`link-${index}`}
                  name="link"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="https://..."
                  value={proj.link}
                  onChange={(e) => handleInputChange(index, e)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`startMonth-${index}`} className="block mb-2 text-sm font-medium text-gray-900">
                    Start Month
                  </label>
                  <input
                    type="month"
                    id={`startMonth-${index}`}
                    name="startMonth"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={displayMonthYear(proj.startMonth)}
                    onChange={(e) => handleInputChange(index, e)}
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor={`endMonth-${index}`} className="block mb-2 text-sm font-medium text-gray-900">
                    End Month
                  </label>
                  <input
                    type="month"
                    id={`endMonth-${index}`}
                    name="endMonth"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={displayMonthYear(proj.endMonth)}
                    onChange={(e) => handleInputChange(index, e)}
                    disabled={proj.endMonth === "Present"}
                    required
                  />
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id={`present-${index}`}
                      name="present"
                      className="mr-2"
                      checked={proj.endMonth === "Present"}
                      onChange={(e) => {
                        const newProjects = [...projects];
                        newProjects[index].endMonth = e.target.checked ? "Present" : "";
                        setProjects(newProjects);
                      }}
                    />
                    <label htmlFor={`present-${index}`} className="text-sm font-medium text-gray-900">
                      Present
                    </label>
                  </div>
                </div>
              </div>
              <div className="z-50">
                <AIEnhancedEditor
                  index={index}
                  content={proj.description}
                  onContentChange={handleQuillChange}
                  label="Description"
                  linecount={2}
                  characterLimit={200}
                  isDescriptionEmpty={proj.description === ''}
                />
              </div>
              
              
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleAddProject}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
        disabled={projects.length >= 4}
      >
        Add Project
      </button>
    </div>
  );
};

export default ProjectForm;