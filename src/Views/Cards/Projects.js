import React, { useEffect, useState,useRef } from 'react';
import { rewriteDescription,rewriteSpecificLine,addPointToDescription } from '../../Models/addInfoModels';
import { GripVertical,ChevronDownIcon,ChevronUpIcon,Pencil,X } from 'lucide-react'; // Assuming you have lucide-react installed
import { s } from 'framer-motion/client';
import gif from '../../Content/In-line editing.gif';

const ProjectForm = ({ projects_data, onChange }) => {
  const [projects, setProjects] = useState(() => {
    if (projects_data && projects_data.length > 0) {
      return projects_data;
    } else {
      return [
      ];
    }
  });

  const [loading, setLoading] = useState({});
  const [aiRewriteState, setAiRewriteState] = useState({});
  const [holdInputBox, setHoldInputBox] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [collapsed, setCollapsed] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [initialDescriptions, setInitialDescriptions] = useState([]);
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

    // For line rewriting functionality
    const [showOverlay, setShowOverlay] = useState([]);
    const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
    const [selectedText, setSelectedText] = useState('');
    const [prompt, setPrompt] = useState('');
    const textareaRef = useRef(null);
    const [selectedLineIndex, setSelectedLineIndex] = useState(null);
    const [isRewriting, setIsRewriting] = useState(false);
    const [lineRewriteState, setLineRewriteState] = useState({});


      // State for GIF visibility
    const [showGif, setShowGif] = useState(false);



    //set the show overlay to false initially
    useEffect(() => {
      setShowOverlay(new Array(projects.length).fill(false));
    }, [projects.length]);



    useEffect(() => {
      if (projects && projects.length > 0) {
        const descriptions = projects.map(proj => proj.description.length > 0);
        setInitialDescriptions(descriptions);
      } else {
        setInitialDescriptions([false]);
      }
    }, []);


    

    //useffect to keep a track of changes in the description and if any one goes to 0, then set its initial description to false
    useEffect(() => {
      
      const updatedDescriptions = projects.map((proj,index)=>{
        if(proj.description.length === 0){
          return false;
        }
        return initialDescriptions[index];
      })

      if(updatedDescriptions.some((desc,index)=>desc !== initialDescriptions[index])){
        setInitialDescriptions(updatedDescriptions);
      }



    }, [projects]);


    const handleSelection = (e, proj,index) => {
      const selection = window.getSelection();
      console.log('Setting overlay for index:', index);

      if (selection && selection.toString().length === 0) {
        setShowOverlay(prev => prev.map((overlay, i) => i === index ? false : overlay));
        return;
      }
      const selectedText = e.target.value.substring(
        e.target.selectionStart,
        e.target.selectionEnd
      );
  
      const findSelectedTextIndex = (description, selectedText) => {
        const points = Array.isArray(description) ? description : description.split('\n');
        return points.findIndex(point => point.includes(selectedText));
      };
  
      const line_index = findSelectedTextIndex(proj.description, selectedText);
      setSelectedLineIndex(line_index);
  
      if (selectedText.length >= 10) {
        setSelectedText(selectedText);
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setOverlayPosition({
          x: rect.x + window.scrollX,
          y: rect.y + window.scrollY - 40
        });
      setShowOverlay(prev => prev.map((overlay, i) => i === index ? true : overlay));
        //print the show overlay
      } else {
        setShowOverlay(prev => prev.map((overlay, i) => i === index ? false : overlay));
        setSelectedLineIndex(null);
      }
    };

    const handleLineRewrite = async (index, lineIndex) => {
      setIsRewriting(true);
      const selectedLine = projects[index].description[lineIndex];
  
      try {
        const response = await rewriteSpecificLine(selectedLine, selectedText, prompt);
  
        if (!response) {
          console.error('No rewrite returned from AI');
          return;
        }
  
        setLineRewriteState({
          projectIndex: index,
          lineIndex: lineIndex,
          original: selectedLine,
          rewritten: response
        });
  
        const newProjects = projects.map((proj, i) =>
          i === index ? {
            ...proj,
            description: proj.description.map((line, j) =>
              j === lineIndex ? response : line
            )
          } : proj
        );
        setProjects(newProjects);
        setIsRewriting(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setIsRewriting(false);
      }
    };
  
    const handleAcceptLineRewrite = () => {
      setLineRewriteState({});

      setShowOverlay(new Array(projects.length).fill(false));
      
    };
  
    const handleRejectLineRewrite = () => {
      const { projectIndex, lineIndex, original } = lineRewriteState;
      const newProjects = projects.map((proj, i) =>
        i === projectIndex ? {
          ...proj,
          description: proj.description.map((line, j) =>
            j === lineIndex ? original : line
          )
        } : proj
      );
      setProjects(newProjects);
      setLineRewriteState({});
    };
  

  useEffect(() => {
    onChange(projects);
  }, [projects, onChange]);

  useEffect(() => {
    //if there is only 1 project, do not collapse it
    if (projects.length === 1) {
      setCollapsed([true]);
    } else {
      setCollapsed(new Array(projects.length).fill(false));
      console.log('All projects are collapsed');
    }

    
  }, []);

  // Update handleAddProject to add a new overlay state
  const handleAddProject = () => {


      setProjects([...projects, { title: '', description: '', link: '' }]);
      setCollapsed([...collapsed, false]);
      setShowOverlay([...showOverlay, false]); // Add new overlay state
    
    setCustomPrompt('');
  };


  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    
    if (name === 'description') {
      const points = value.split('\n');
      if (points[points.length - 1] === '') {
        points.pop();
      }
      const newProjects = projects.map((proj, i) =>
        i === index ? { ...proj, [name]: points } : proj
      );
      setProjects(newProjects);
    } else {
     

      const newProjects = projects.map((proj, i) =>
        i === index ? { ...proj, [name]: value } : proj
      );
      setProjects(newProjects);
      console.log(newProjects);
    }
  };

  // Update handleDeleteProject to remove the corresponding overlay state
  const handleDeleteProject = (index) => {
    const newProjects = projects.filter((_, i) => i !== index);
    setProjects(newProjects);
    setCollapsed(collapsed.filter((_, i) => i !== index));
    setShowOverlay(showOverlay.filter((_, i) => i !== index)); // Remove overlay state
    setCustomPrompt('');
  };

  const handleAIRewrite = async (index, description) => {
    setLoading(prev => ({ ...prev, [index]: true }));
    setAiRewriteState(prev => ({ ...prev, [index]: { original: description, rewritten: null } }));
    setHoldInputBox(true);
    setIsGeneratingDescription(true);

    try {
      const response = await rewriteDescription(description);
      const data = response;

      const formattedBulletPoints = data;

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
      setHoldInputBox(false);
      setIsGeneratingDescription(false);

      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      setLoading(prev => ({ ...prev, [index]: false }));
      setHoldInputBox(false);
    }
  };

  const handleAcceptRewrite = (index) => {
    setInitialDescriptions(prev => ({ ...prev, [index]: true }));
    const newProjects = projects.map((project, i) =>
      i === index ? { ...project, description: aiRewriteState[index].rewritten } : project
    );
    setProjects(newProjects);
    setAiRewriteState(prev => ({ ...prev, [index]: null }));
  };

  const handleRejectRewrite = (index) => {
    setAiRewriteState(prev => ({ ...prev, [index]: null }));
    const newProjects = projects.map((project, i) =>
      i === index ? { ...project, description: [] } : project
    );
    setProjects(newProjects);
  };

  const handleDescriptionKeyDown = (index, event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const textarea = event.target;
      const cursorPosition = textarea.selectionStart;
      let currentValue = textarea.value;
  
      const lines = currentValue.split('\n');
      if (lines.length > 0) {
        const lastLine = lines[lines.length - 1].trim();
        if (lastLine && !lastLine.endsWith('.')) {
          currentValue = lines.join('\n');
        }
      }
  
      const newValue = currentValue.slice(0, cursorPosition) + '\n' + currentValue.slice(cursorPosition);
      const points = newValue.split('\n');
      const newProjects = projects.map((proj, i) =>
        i === index ? { ...proj, description: points } : proj
      );
      setProjects(newProjects);
  
      setTimeout(() => {
        const updatedTextarea = document.getElementById(`project-description-${index}`);
        if (updatedTextarea) {
          updatedTextarea.selectionStart = cursorPosition + 1;
          updatedTextarea.selectionEnd = cursorPosition + 1;
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

  const handleDragStart = (e, index) => {
    console.log('Drag start:', index);
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
  };

  const handleDragOver = (e,index) => {
    e.preventDefault();
    if (draggedItem == null) {
      return;
    }
    const newProjects = [...projects];
    const draggedItemContent = newProjects[draggedItem];
    newProjects.splice(draggedItem, 1);
    newProjects.splice(index, 0, draggedItemContent);
    setDraggedItem(index);
    setProjects(newProjects);
  };
  const handleAddpoint = async (index) => {
      try {

        setIsAddingPoint(true);
        const response = await addPointToDescription(projects[index].description, customPrompt);



        const newProjects = projects.map((project, i) => {
          if (i === index) {
            const updatedDescription = Array.isArray(project.description)
              ? [...project.description, response]
              : [project.description, response];
            return { ...project, description: updatedDescription };
          }
          return project;
        });
        setProjects(newProjects);
        setIsAddingPoint(false);
        
      } catch (error) {
        console.error('Error adding point to description:', error);
      }
    };


  const displayMonthYear = (date) => {
    
    if(!date) return '';
    //convert  YYYY-MM-DD to YYYY-MM
    return date.slice(0, 7);

  };

  return (
    <div>

      {showGif && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg relative">
            <button
              onClick={() => setShowGif(false)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 focus:outline-none"
              aria-label="Close GIF"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold mb-4">In-line Editing Guide</h2>
            <img src={gif} alt="In-line editing GIF" className="max-w-full h-auto p-8" />
          </div>
        </div>
      )}
    
    <div className="flex flex-col items-start space-y-4 max-w-3xl mx-auto bg-white">
      {projects.map((project, index) => (
        <div
          key={index}
          className="w-full border border-gray-200 rounded-lg overflow-hidden"
        >
          <div
            className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
            onClick={() => handleCollapseToggle(index)}
          >
            <div className="flex items-center space-x-2">
              <div
                draggable={true}
                onDragStart={(e) => handleDragStart(e,index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
              >
                <GripVertical className="w-5 h-5 cursor-grab" />
              </div>
              {collapsed[index] ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
              <h3 className="font-medium">
                {project.title || project.link ?
                  `${project.title}${project.link ? ` - ${project.link}` : ''}` :
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
  
          {collapsed[index] && (
            <div className="p-4 space-y-4">
              <div>
                <label htmlFor={`title-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Project Title</label>
                <input
                  type="text"
                  id={`title-${index}`}
                  name="title"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Project Title"
                  value={project.title}
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
                  value={project.link}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                />
              </div>
  
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`startMonth-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Start Month</label>
                  <input
                    type="month"
                    id={`startMonth-${index}`}
                    name="startMonth"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={displayMonthYear(project.startMonth)}
                    onChange={(e) => handleInputChange(index, e)}
                    required
                  />
                </div>
  
                <div className="flex flex-col">
                  <label htmlFor={`endMonth-${index}`} className="block mb-2 text-sm font-medium text-gray-900">End Month</label>
                  <input
                    type="month"
                    id={`endMonth-${index}`}
                    name="endMonth"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={displayMonthYear(project.endMonth)}
                    onChange={(e) => handleInputChange(index, e)}
                    disabled={project.endMonth === "Present"}
                    required
                  />
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id={`present-${index}`}
                      name="present"
                      className="mr-2"
                      checked={project.endMonth === "Present"}
                      onChange={(e) => {
                        const newProjects = [...projects];
                        newProjects[index].endMonth = e.target.checked ? "Present" : "";
                        setProjects(newProjects);
                      }}
                    />
                    <label htmlFor={`present-${index}`} className="text-sm font-medium text-gray-900">Present</label>
                  </div>
                </div>
              </div>
  
              <div>
                <div className="relative">
                  <div className='flex justify-between space-x-4'>
                    <div className='flex space-x-2 items-start justify-center'>
                    <label htmlFor={`description-${index}`} className="block mb-2 text-sm font-medium text-gray-900">
                      Description (Press Enter for New Point)
                    </label>
                      <button
                        onClick={() => setShowGif(true)}
                        className="text-yellow-500 hover:text-yellow-700 focus:outline-none mt-0 rounded-full shadow-lg text-l"
                        aria-label="Show GIF"
                      >
                        💡
                      </button>

                    </div>
                    {showOverlay[index] && (
                      isRewriting ? (
                        <div
                          className="absolute z-10 bg-blue-50 shadow-lg rounded-lg p-4 flex items-center justify-center border border-blue-200"
                          style={{
                            top: 'calc(50% - 10rem)',
                            left: 'calc(50% - 15rem)',
                          }}
                        >
                          <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
                        </div>
                      ) : (
                        <div
                          className="absolute z-10 bg-blue-50 shadow-lg rounded-lg p-4 flex flex-col gap-3 border border-blue-200 max-w-md"
                          style={{
                            top: 'calc(50% - 10rem)',
                            left: 'calc(50% - 15rem)',
                          }}
                        >
                          <p className="text-sm text-blue-800 font-semibold truncate">
                            "{selectedText.length > 50 ? `${selectedText.substring(0, 70)}...` : selectedText}"
                          </p>
                          <div className="flex items-center space-x-2">
                            <div className="text-sm text-gray-700">No.</div>
                            <input
                              type="number"
                              value={selectedLineIndex !== null ? selectedLineIndex + 1 : ''}
                              onChange={(e) => {
                                const newIndex = parseInt(e.target.value, 10);
                                setSelectedLineIndex(!isNaN(newIndex) ? newIndex : null);
                              }}
                              className="w-16 text-sm border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                              placeholder="Line #"
                            />
                            <input
                              type="text"
                              placeholder="Prompt..."
                              className="w-full text-sm border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                              value={prompt}
                              onChange={(e) => setPrompt(e.target.value)}
                            />
                            {!lineRewriteState.rewritten ? (
                              <button
                                onClick={() => handleLineRewrite(index, selectedLineIndex)}
                                className="p-2 bg-blue-500 text-white hover:bg-blue-600 rounded-full transition"
                                title="Rewrite selected text"
                              >
                                <Pencil size={14} />
                              </button>
                            ) : (
                              <div className="flex space-x-2">
                                <button
                                  onClick={handleAcceptLineRewrite}
                                  className="p-2 bg-green-500 text-white hover:bg-green-600 rounded-full transition"
                                  title="Accept rewrite"
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={handleRejectLineRewrite}
                                  className="p-2 bg-red-500 text-white hover:bg-red-600 rounded-full transition"
                                  title="Reject rewrite"
                                >
                                  ✗
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      id={`description-${index}`}
                      name="description"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 selection:bg-yellow-200 selection:text-black"
                      placeholder="Briefly describe your project and let the AI rewrite it for you."
                      value={aiRewriteState[index]?.rewritten || (Array.isArray(project.description) ? project.description.join('\n') : project.description)}
                      onChange={(e) => handleInputChange(index, e)}
                      onSelect={(e) => handleSelection(e, project, index)}
                      style={{
                        minHeight: '150px',
                        backgroundColor: aiRewriteState[index]?.rewritten ? '#A2FFA7' : 'white',
                      }}
                      onKeyDown={(e) => handleDescriptionKeyDown(index, e)}
                      disabled={holdInputBox}
                      required
                    />
                  </div>
                </div>
  
                <div className="flex justify-start space-x-4 text-sm text-gray-500 mt-2">
                  {!initialDescriptions[index] ? (
                    <button
                      onClick={() => {
                       
                        handleAIRewrite(index, project.description);}}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      disabled={loading[index] || aiRewriteState[index]}
                    >
                      {isGeneratingDescription ? (
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        'Generate Description'
                      )}
                    </button>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="In simple words, what's the point?"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 flex-grow"
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                      />
                      <button
                        onClick={() => {
                          handleAddpoint(index);
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        disabled={loading[index] || aiRewriteState[index]}
                      >
                        {isAddingPoint ? (
                          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          'Add Point'
                        )}
                      </button>
                    </>
                  )}
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
            </div>
          )}
        </div>
      ))}
  
      <button
        onClick={handleAddProject}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none"

      >
        Add Project
      </button>
    </div>

    </div>
  );
};

export default ProjectForm;