import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { rewriteDescription, rewriteSpecificLine,addPointToDescription } from '../../Models/addInfoModels';
import { Plus, Trash2, Edit2, GripVertical, Pencil } from 'lucide-react';

const WorkExperienceForm = ({ workExperience, onChange }) => {

  const [loading, setLoading] = useState({});
  const [aiRewriteState, setAiRewriteState] = useState({});
  const [holdInputBox, setHoldInputBox] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const [initialDescriptions, setInitialDescriptions] = useState([]);
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  useEffect(() => {
    if (workExperience && workExperience.length > 0) {
      const descriptions = workExperience.map(exp => exp.description.length > 0);
      console.log(descriptions); // Log the descriptions array
      setInitialDescriptions(descriptions);
    } else {
      setInitialDescriptions([false]);
    }
  }, []);

  useEffect(() => {

    const updatedDescriptions = workExperience.map((exp, index) => {
      if (exp.description.length === 0) {
      return false;
      }
      return initialDescriptions[index];
    });

    if (updatedDescriptions.some((desc, index) => desc !== initialDescriptions[index])) {
      setInitialDescriptions(updatedDescriptions);
    }

  }, [workExperience]);



  //for the text area
  const [showOverlay, setShowOverlay] = useState([]);

  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef(null);
  const [selectedLineIndex, setSelectedLineIndex] = useState(null);
  const [isRewriting, setIsRewriting] = useState(false);

  useEffect(() => {
    setShowOverlay(new Array(workExperience.length).fill(false));

  }, [workExperience.length]);


  const handleSelection = (e, exp,index) => {

    const selection = window.getSelection();

    
    if (selection && selection.toString().length === 0) {
      setShowOverlay(prev => prev.map((overlay, i) => i === index ? false : overlay));
    }
    const selectedText = e.target.value.substring(
      e.target.selectionStart,
      e.target.selectionEnd
    );
    if (selectedText.includes('\n')) {
      alert('Please select only one point at a time.');
      // Clear the selection
      e.target.selectionStart = e.target.selectionEnd;

      return;
    }
    const findSelectedTextIndex = (description, selectedText) => {
      const points = Array.isArray(description) ? description : description.split('\n');
      return points.findIndex(point => point.includes(selectedText));
    };

    const line_index = findSelectedTextIndex(exp.description, selectedText);
    setSelectedLineIndex(line_index);

    if (selectedText.length >= 10) {
      setSelectedText(selectedText);

      // Get the selection coordinates
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Position the overlay above the selection
      setOverlayPosition({
        x: rect.x + window.scrollX,
        y: rect.y + window.scrollY - 40 // 40px above the selection
      });

      setShowOverlay(prev => prev.map((overlay, i) => i === index ? true : overlay));
      console.log(overlayPosition);
      console.log(showOverlay);
    } else {
      setShowOverlay(prev => prev.map((overlay, i) => i === index ? false : overlay));
      setSelectedLineIndex(null);

    }
  };


  const [experiences, setExperiences] = useState(() => {
    if (workExperience && workExperience.length > 0) {
      return workExperience;
    } else {
      return [];
    }
  });

  useEffect(() => {
    if (workExperience.length == 1) {
      setExpandedSections({ 0: true });
    }
  }, []);

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

      setShowOverlay(...showOverlay, false); // Add new overlay state
    }
  };


  const handleInputChange = (index, event) => {
    const { name, value, selectionStart } = event.target;

    if (name === 'description') {
      //convert the string into an array by spliting it by new line
      const points = value.split('\n');

      //if the last point is empty, remove it
      if (points[points.length - 1] === '') {
        points.pop();
      }

      //set this array as the new value
      const newValue = points;

      const newExperiences = experiences.map((exp, i) =>
        i === index ? { ...exp, [name]: newValue } : exp
      );
      setExperiences(newExperiences);


    }
    else {
      const newExperiences = experiences.map((exp, i) =>
        i === index ? { ...exp, [name]: value } : exp
      );
      setExperiences(newExperiences);
    }

  };

  const handleDeleteExperience = (index) => {

    const newExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(newExperiences);

  };

  const handleAIrewrite = async (index, description) => {

    setIsGeneratingDescription(true);

    setHoldInputBox(true);
    try {
      const response = await rewriteDescription(description);
      const data = response;

      if (!data) {
        console.error('No bullet points returned from AI');
        return;
      }

      const formattedBulletPoints = data;

      setAiRewriteState(prev => ({
        ...prev,
        [index]: { ...prev[index], rewritten: formattedBulletPoints }
      }));
      setLoading(prev => ({ ...prev, [index]: false }));
      //set the sections to the new bullet points
      const newExperiences = experiences.map((exp, i) =>
        i === index ? { ...exp, description: formattedBulletPoints } : exp
      );
      setExperiences(newExperiences);
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
    const newExperiences = experiences.map((exp, i) =>
      i === index ? { ...exp, description: aiRewriteState[index].rewritten } : exp
    );
    setExperiences(newExperiences);
    setAiRewriteState(prev => ({ ...prev, [index]: null }));
    setInitialDescriptions(prev => ({ ...prev, [index]: true }));

  };

  const handleRejectRewrite = (index) => {
    setAiRewriteState(prev => ({ ...prev, [index]: null }));
    // Set the sections to the original bullet points
    const newExperiences = experiences.map((exp, i) =>
      i === index ? { ...exp, description: [] } : exp
    );
    setExperiences(newExperiences);

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
          currentValue = lines.join('\n');
        }
      }

      // Add new bullet point
      const newValue = currentValue + '\n';

      //just like the handleInputChange function, we need to convert the string into an array
      const points = newValue.split('\n');

      //set this array as the new value

      const newExperiences = experiences.map((exp, i) =>
        i === index ? { ...exp, description: points } : exp
      );
      setExperiences(newExperiences);


      // Set cursor position
      setTimeout(() => {
        const textarea = document.getElementById(`experience-description-${index}`);
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

  const displayMonthYear = (date) => {

    if (!date) return '';
    //convert  YYYY-MM-DD to YYYY-MM
    return date.slice(0, 7);

  };

  const [lineRewriteState, setLineRewriteState] = useState({});

  const handleLineRewrite = async (index, lineIndex) => {
    setIsRewriting(true);
    const selectedLine = experiences[index].description[lineIndex];
    const description = experiences[index].description;
    try {
      const response = await rewriteSpecificLine(selectedLine, selectedText, prompt,description);

      if (!response) {
        console.error('No rewrite returned from AI');
        return;
      }

      // Store both original and rewritten versions
      setLineRewriteState({
        experienceIndex: index,
        lineIndex: lineIndex,
        original: selectedLine,
        rewritten: response
      });

      // Update the experience temporarily with the rewritten line
      const newExperiences = experiences.map((exp, i) =>
        i === index ? {
          ...exp,
          description: exp.description.map((line, j) =>
            j === lineIndex ? response : line
          )
        } : exp
      );
      setExperiences(newExperiences);

      setIsRewriting(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setIsRewriting(false);
    }
  };

  const handleAcceptLineRewrite = () => {
    // Clear the line rewrite state
    setLineRewriteState({});
    setShowOverlay(new Array(workExperience.length).fill(false));
  };

  const handleRejectLineRewrite = () => {
    // Restore the original line
    const { experienceIndex, lineIndex, original } = lineRewriteState;

    const newExperiences = experiences.map((exp, i) =>
      i === experienceIndex ? {
        ...exp,
        description: exp.description.map((line, j) =>
          j === lineIndex ? original : line
        )
      } : exp
    );

    setExperiences(newExperiences);
    setLineRewriteState({});

  };



    const handleAddpoint = async (index) => {
      try {

        setIsAddingPoint(true);
        const response = await addPointToDescription(experiences[index].description, customPrompt);



        // Add the new point to the description
        const newExperiences = experiences.map((exp, i) =>
          i === index ? { ...exp, description: [...exp.description, response] } : exp
        );
        setExperiences(newExperiences);
        setIsAddingPoint(false);
      } catch (error) {
        console.error('Error adding point to description:', error);
      }
    };
  


  return (
    <div className="flex flex-col items-start space-y-4 max-w-3xl mx-auto bg-white">
      {experiences.map((exp, index) => (
        <div
          key={index}
          className="w-full border border-gray-200 rounded-lg overflow-hidden"
        >          <div
          className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
          onClick={() => toggleSection(index)}
        >
            <div className="flex items-center space-x-2">
              <div
                draggable={true}
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


              <div>
              </div>
              <div>
                <div className="relative">

                  <div className='flex justify-spacebetween space-x-4'>
                    <label htmlFor={`description-${index}`} className="block mb-2 text-sm font-medium text-gray-900">
                      Description (Press Enter for New Point)
                    </label>
                    {showOverlay[index] && (
                      isRewriting ? (
                        // Show a loading spinner
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
                        <div className="absolute z-10 bg-blue-50 shadow-lg rounded-lg p-4 flex flex-col gap-3 border border-blue-200 max-w-md" style={{ top: 'calc(50% - 10rem)', left: 'calc(50% - 15rem)' }}>
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
                            {/* <button
                              onClick={() => document.execCommand('bold')}
                              className="p-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full transition"
                              title="Bold"
                            >
                              <b>B</b>
                            </button>
                            <button
                              onClick={() => document.execCommand('underline')}
                              className="p-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full transition"
                              title="Underline"
                            >
                              <u>U</u>
                            </button>
                            <button
                              onClick={() => document.execCommand('italic')}
                              className="p-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full transition"
                              title="Italic"
                            >
                              <i>I</i>
                            </button> */}
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
                      placeholder="Breifly describe your role and responsibilities and let the AI rewrite it for you."
                      value={aiRewriteState[index]?.rewritten || (Array.isArray(exp.description) ? exp.description.join('\n') : exp.description)}
                      onChange={(e) => handleInputChange(index, e)}
                      onKeyDown={(e) => handleDescriptionKeyDown(index, e)}

                      onSelect={(e) => handleSelection(e, exp,index)}

                      style={{
                        minHeight: '150px',
                        backgroundColor: aiRewriteState[index]?.rewritten ? '#A2FFA7' : 'white',
                      }}
                      disabled={holdInputBox}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-start space-x-4 text-sm text-gray-500 mt-2">
                  {!initialDescriptions[index] ? (
                    
                    <button
                      onClick={() => {
                        handleAIrewrite(index, exp.description);
                      }}
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
                        placeholder="Enter custom prompt"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 flex-grow"
                        value={customPrompt}
                        onChange={handleCustomPromptChange}
                      />
                      <button
                        onClick={
                          () =>{
                            handleAddpoint(index); 
                          }
                      }
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        disabled={isAddingPoint || aiRewriteState[index]}
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