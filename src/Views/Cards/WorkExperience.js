import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

const WorkExperienceForm = ({ workExperience, onChange }) => {

  const [loading, setLoading] = useState({});
  const [aiRewriteState, setAiRewriteState] = useState({});
  const [holdInputBox, setHoldInputBox] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
  
  const [experiences, setExperiences] = useState(() => {
    if (workExperience && workExperience.length > 0) {
      return workExperience;
    } else {
      return [{
        company: '', jobTitle: '', startDate: '', endDate: '', location: '', description: '• '
      }];
    }
  });

  useEffect(() => {
    // Initialize the first section as expanded
    setExpandedSections({ 0: true });
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
      setExperiences([...experiences, { company: '', jobTitle: '', startDate: '', endDate: '', location: '', description: '• ' }]);
      setExpandedSections(prev => ({
        ...prev,
        [newIndex]: true
      }));
    }
  };

  const formatToBulletPoints = (text) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    return lines.map(line => line.trim().startsWith('•') ? line : `• ${line}`).join('\n');
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newExperiences = experiences.map((exp, i) =>
      i === index
        ? { ...exp, [name]: name === 'description' ? formatToBulletPoints(value) : value }
        : exp
    );
    setExperiences(newExperiences);
  };

  const handleDeleteExperience = (index) => {
    if (experiences.length > 1) {
      const newExperiences = experiences.filter((_, i) => i !== index);
      setExperiences(newExperiences);
    }
  };

  const handleAIrewrite = async (index, description) => {
    setLoading(prev => ({ ...prev, [index]: true }));
    setAiRewriteState(prev => ({ ...prev, [index]: { original: description, rewritten: null } }));

    setHoldInputBox(true);
    try {
      const response = await fetch('https://flask-hello-world-two-dusky.vercel.app/rewrite_description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: description,
          prompt: customPrompt || undefined, // Send custom prompt if provided
        }),
      });
      const data = await response.json();

      if (!data.bullet_points) {
        console.error('No bullet points returned from AI');
        return;
      }

      const formattedBulletPoints = data.bullet_points.split('\n\n').map(point => `• ${point.trim()}`).join('\n');

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
    setCustomPrompt('');
  };

  const handleRejectRewrite = (index) => {
    setAiRewriteState(prev => ({ ...prev, [index]: null }));
    //set the sections to the original bullet points
    const newExperiences = experiences.map((exp, i) =>
      i === index ? { ...exp, description: aiRewriteState[index].original } : exp
    );
    setExperiences(newExperiences);
    setCustomPrompt('');
  };

  const handleDescriptionKeyDown = (index, event) => {
    if (event.key === 'Enter' && event.target.selectionStart === event.target.value.length) {
      event.preventDefault();
      const newValue = event.target.value + '\n• ';
      const newExperiences = experiences.map((exp, i) =>
        i === index ? { ...exp, description: newValue } : exp
      );
      setExperiences(newExperiences);

      setTimeout(() => {
        event.target.selectionStart = newValue.length;
        event.target.selectionEnd = newValue.length;
      }, 0);
    }
  };

  const handleCustomPromptChange = (event) => {
    setCustomPrompt(event.target.value);
  };

  return (
    <div className="flex flex-col items-start space-y-4 max-w-3xl mx-auto bg-white">
      {experiences.map((exp, index) => (
        <div key={index} className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <div 
            className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
            onClick={() => toggleSection(index)}
          >
            <div className="flex items-center space-x-2">
              {expandedSections[index] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              <h3 className="font-medium">
                {exp.company || exp.jobTitle ? 
                  `${exp.company}${exp.jobTitle ? ` - ${exp.jobTitle}` : ''}` : 
                  `Work Experience ${index + 1}`
                }
              </h3>
            </div>
            {experiences.length > 1 && (
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
            )}
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

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor={`startDate-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Start Date</label>
                  <input
                    type="date"
                    id={`startDate-${index}`}
                    name="startDate"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={exp.startDate}
                    onChange={(e) => handleInputChange(index, e)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor={`endDate-${index}`} className="block mb-2 text-sm font-medium text-gray-900">End Date</label>
                  <input
                    type="date"
                    id={`endDate-${index}`}
                    name="endDate"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={exp.endDate}
                    onChange={(e) => handleInputChange(index, e)}
                    required
                  />
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
                <label htmlFor={`description-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Description (Bullet Points)</label>
                <textarea
                  id={`description-${index}`}
                  name="description"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="• Enter your bullet points here"
                  value={aiRewriteState[index]?.rewritten || exp.description}
                  onChange={(e) => handleInputChange(index, e)}
                  onKeyDown={(e) => handleDescriptionKeyDown(index, e)}
                  style={{ 
                    minHeight: '150px', 
                    backgroundColor: aiRewriteState[index]?.rewritten ? '#A2FFA7' : 'white'
                  }}
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
                    onClick={() => handleAIrewrite(index, exp.description)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    disabled={loading[index] || aiRewriteState[index]}
                  >
                    {loading[index] ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"/>
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
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRewrite(index)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                      Reject
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