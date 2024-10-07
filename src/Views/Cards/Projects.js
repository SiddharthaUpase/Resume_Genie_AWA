import React, { useEffect, useState } from 'react';
import { rewriteProjectDescription } from '../../Models/addInfoModels';
import { GripVertical,ChevronDownIcon,ChevronUpIcon } from 'lucide-react'; // Assuming you have lucide-react installed

const ProjectForm = ({ projects_data, onChange }) => {
  const [projects, setProjects] = useState(() => {
    if (projects_data && projects_data.length > 0) {
      return projects_data;
    } else {
      return [
        { title: '', description: '', link: '' }
      ];
    }
  });

  const [loading, setLoading] = useState({});
  const [aiRewriteState, setAiRewriteState] = useState({});
  const [holdInputBox, setHoldInputBox] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [collapsed, setCollapsed] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    onChange(projects);
  }, [projects, onChange]);

  useEffect(() => {
    //if there is only 1 project, do not collapse it
    if (projects.length === 1) {
      setCollapsed([false]);
    } else {
      setCollapsed(new Array(projects.length).fill(true));
    }

    
  }, []);

  const handleAddProject = () => {
    if (projects.length < 3) {
      setProjects([...projects, { title: '', description: '• ', link: '' }]);
      setCollapsed([...collapsed, false]);
    }
    setCustomPrompt('');
  };

  const formatToBulletPoints = (text) => {
    // Remove existing bullet points
    text = text.replace(/•/g, '');
  
    // Regular expression that matches periods that are:
    // 1. Not preceded by a number (?<!\d)
    // 2. Not followed by a number (?!\d)
    // 3. Not part of common abbreviations like Mr., Dr., etc.
    const sentenceEndRegex = /(?<!\d)\.(?!\d)(?!\s*[A-Z][a-z]\.)/g;
  
    // Split by the regex and filter out empty sentences
    const sentences = text.split(sentenceEndRegex)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence !== '');
  
    // Add a period to the end of each sentence and map to bullet points
    return sentences
      .map(sentence => `• ${sentence.trim()}${sentence.endsWith('.') ? '' : '.'}`)
      .join('\n');
  };

  const handleInputChange = (index, event) => {
    const { name, value, selectionStart } = event.target;
    
    if (name === 'description') {
      // Only reformat if a period was added
      const periods = value.match(/\./g)?.length || 0;
      const oldPeriods = projects[index].description.match(/\./g)?.length || 0;
      
      let newValue = value;
      if (periods > oldPeriods) {
        newValue = formatToBulletPoints(value);
      }
      
      const newProjects = [...projects];
      newProjects[index] = {
        ...newProjects[index],
        [name]: newValue
      };
      setProjects(newProjects);
      
      // If we reformatted, we need to defer setting the cursor position
      if (periods > oldPeriods) {
        setTimeout(() => {
          const textarea = document.getElementById(`description-${index}`);
          if (textarea) {
            textarea.selectionStart = selectionStart;
            textarea.selectionEnd = selectionStart;
          }
        }, 0);
      }
    } else {
      const newProjects = [...projects];
      newProjects[index] = {
        ...newProjects[index],
        [name]: value
      };
      setProjects(newProjects);
    }
  };

  const handleDeleteProject = (index) => {

      const newProjects = projects.filter((_, i) => i !== index);
      setProjects(newProjects);
      setCollapsed(collapsed.filter((_, i) => i !== index));
    
    setCustomPrompt('');
  };

  const handleAIRewrite = async (index, description) => {
    setLoading(prev => ({ ...prev, [index]: true }));
    setAiRewriteState(prev => ({ ...prev, [index]: { original: description, rewritten: null } }));
    setHoldInputBox(true);

    try {
      const response = await rewriteProjectDescription(description, customPrompt);
      const data = response;

      const formattedBulletPoints = data.split('\n\n').map(point => `• ${point.trim()}`).join('\n');

      setAiRewriteState(prev => ({
        ...prev,
        [index]: { ...prev[index], rewritten: formattedBulletPoints }
      }));
      setLoading(prev => ({ ...prev, [index]: false }));
      setHoldInputBox(false);

      const newProjects = projects.map((project, i) =>
        i === index ? { ...project, description: formattedBulletPoints } : project
      );
      setProjects(newProjects);
      console.log(projects);

      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      setLoading(prev => ({ ...prev, [index]: false }));
      setHoldInputBox(false);
    }
  };

  const handleAcceptRewrite = (index) => {
    const newProjects = projects.map((project, i) =>
      i === index ? { ...project, description: aiRewriteState[index].rewritten } : project
    );
    setProjects(newProjects);
    setAiRewriteState(prev => ({ ...prev, [index]: null }));
  };

  const handleRejectRewrite = (index) => {
    setAiRewriteState(prev => ({ ...prev, [index]: null }));
    const newProjects = projects.map((project, i) =>
      i === index ? { ...project, description: aiRewriteState[index].original } : project
    );
    setProjects(newProjects);
  };

  const handleDescriptionKeyDown = (index, event) => {
    if (event.key === 'Enter' && event.target.selectionStart === event.target.value.length) {
      event.preventDefault();
      
      // Get the current value and split it into lines
      let currentValue = event.target.value;
      const lines = currentValue.split('\n');
      
      // Check if the last line needs a period
      if (lines.length > 0) {
        const lastLine = lines[lines.length - 1].trim();
        if (lastLine && !lastLine.endsWith('.')) {
          lines[lines.length - 1] = lastLine + '.';
          currentValue = lines.join('\n');
        }
      }
      
      // Add new bullet point
      const newValue = currentValue + '\n• ';
      
      const newProjects = projects.map((project, i) =>
        i === index ? { ...project, description: newValue } : project
      );
      setProjects(newProjects);
  
      // Set cursor position
      setTimeout(() => {
        const textarea = document.getElementById(`description-${index}`);
        if (textarea) {
          textarea.selectionStart = newValue.length;
          textarea.selectionEnd = newValue.length;
        }
      }, 0);
    }
  };

  const handleCustomPromptChange = (event) => {
    setCustomPrompt(event.target.value);
  };

  const handleCollapseToggle = (index) => {
    setCollapsed(collapsed.map((state, i) => i === index ? !state : state));
  };

  const handleDragStart = (index) => (event) => {
    setDraggedItem(index);
    event.dataTransfer.setData('text/plain', index);
  };

  const handleDrop = (index) => (event) => {
    event.preventDefault();
    setDraggedItem(null);
  };

  const handleDragOver = (index) => (event) => {
    event.preventDefault();

    if (draggedItem == null) {
      return;
    }

    const newProjects = [...projects];
    const [draggedProject] = newProjects.splice(draggedItem, 1);
    newProjects.splice(index, 0, draggedProject);
    setProjects(newProjects);
    setDraggedItem(index);
    


  };
  const handleReformat = (index, description) => {
    //just clear the description and paste it back to trigger the reformat
    const newProjects = [...projects];
    newProjects[index] = {
      ...newProjects[index],
      description: ''
    };

    setProjects(newProjects);

    setTimeout(() => {
      const newProjects = [...projects];
      newProjects[index] = {
        ...newProjects[index],
        description
      };
      setProjects(newProjects);
    }
    );
  }

  return (
    <div className="flex flex-col items-start space-y-4 max-w-3xl mx-auto bg-white">
      {projects.map((project, index) => (
        <div
          key={index}
          className="space-y-4 p-4 border border-gray-200 rounded-lg relative w-full"
          
        >
          <div className="flex items-center space-x-2">
            <div className="cursor-grab" draggable onDragStart={handleDragStart(index)} onDrop={handleDrop(index)} onDragOver={handleDragOver(index)} >

            <GripVertical className="cursor-grab" />
            </div>
            <button
              onClick={() => handleCollapseToggle(index)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Collapse project entry"
            >
              {collapsed[index] ? <ChevronDownIcon size={24} /> : <ChevronUpIcon size={24} />}
            </button>
            {collapsed[index] && (
              <h3 className='font-medium'>
                {project.title || 'Untitled Project'}
              </h3>
            )}
            
              
            
          </div>
          {!collapsed[index] && (
            <>
              <div>
                <label htmlFor={`title-${index}`} className="block mb-2 text-sm font-medium text-gray-900 ">Project Title</label>
                <input
                  type="text"
                  id={`title-${index}`}
                  name="title"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5   "
                  placeholder="Project Title"
                  value={project.title}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                />
              </div>
              <div>
                <label htmlFor={`link-${index}`} className="block mb-2 text-sm font-medium text-gray-900 ">Project Link</label>
                <input
                  type="url"
                  id={`link-${index}`}
                  name="link"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5   "
                  placeholder="https://..."
                  value={project.link}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                />
              </div>

              <div className="flex space-x-4">
                <div>
                  <label htmlFor={`start-month-${index}`} className="block mb-2 text-sm font-medium text-gray-900 ">Start Month</label>
                  <input
                    type="month"
                    id={`start-month-${index}`}
                    name="startMonth"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                    value={project.startMonth || ''}
                    onChange={(e) => handleInputChange(index, e)}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <div>
                    <label htmlFor={`end-month-${index}`} className="block mb-2 text-sm font-medium text-gray-900 ">End Month</label>
                    <input
                      type="month"
                      id={`end-month-${index}`}
                      name="endMonth"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                      value={project.endMonth || ''}
                      onChange={(e) => handleInputChange(index, e)}
                      //if the end month is present, disable the input
                      disabled={project.endMonth === 'Present'}
                      
                    />
                  </div>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id={`present-${index}`}
                      name="present"
                      className="mr-2"
                      checked= {project.endMonth === 'Present' }
                      onChange={(e) => {
                        const newProjects = projects.map((project, i) =>
                          i === index ? { ...project, endMonth: e.target.checked ? 'Present' : '' } : project
                        );
                        setProjects(newProjects);
                      }}
                    />
                    <label htmlFor={`present-${index}`} className="text-sm font-medium text-gray-900 ">Present</label>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                <label htmlFor={`description-${index}`} className="block mb-2 text-sm font-medium text-gray-900 ">Description (Period Seperated)</label>

                {/* <button
                  onClick={() => handleReformat(index, project.description)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Reformat
                </button> */}

                </div>
                <textarea
                  id={`description-${index}`}
                  onKeyDown={(e) => handleDescriptionKeyDown(index, e)}
                  name="description"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                  placeholder="• Enter your bullet points here"
                  value={aiRewriteState[index]?.rewritten || project.description}
                  onChange={(e) => handleInputChange(index, e)}
                  style={{ minHeight: '150px', backgroundColor: aiRewriteState[index]?.rewritten ? '#A2FFA7' : 'white' }}
                  disabled={holdInputBox}
                  required
                />
                <div className="flex justify-start space-x-4 text-sm text-gray-500 mt-2">
                  <input
                    type="text"
                    placeholder="Enter custom prompt"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 flex-grow"
                    value={customPrompt}
                    onChange={handleCustomPromptChange}
                  />
                  <button
                    onClick={() => handleAIRewrite(index, project.description)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    disabled={loading[index] || aiRewriteState[index]}
                  >
                    {loading[index] ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                    ) : (
                      'AI Rewrite'
                    )}
                  </button>
                </div>
                {aiRewriteState[index]?.rewritten && (
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => handleAcceptRewrite(index)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    >
                      ✓ Accept
                    </button>
                    <button
                      onClick={() => handleRejectRewrite(index)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                      ✗ Reject
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="flex justify-end items-center space-x-4">

          <button
            onClick={() => handleDeleteProject(index)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Delete project entry"
          >
            <span style={{ fontSize: '0.75rem' }}>❌</span>
          </button>

          </div>

        </div>
      ))}
      <button
        onClick={handleAddProject}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
        disabled={projects.length >= 3}
      >
        Add Project
      </button>
    </div>
  );
};

export default ProjectForm;