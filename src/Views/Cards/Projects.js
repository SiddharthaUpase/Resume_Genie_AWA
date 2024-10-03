import React, { useEffect, useState } from 'react';

const ProjectForm = ({ projects_data, onChange }) => {
  const [projects, setProjects] = useState(() => {
    if (projects_data && projects_data.length > 0) {
      return projects_data;
    } else {
      return [
        { title: '', description: '• ', link: '' }
      ];
    }
  });

  const [loading, setLoading] = useState({});
  const [aiRewriteState, setAiRewriteState] = useState({});
  const [holdInputBox, setHoldInputBox] = useState(false);

  const [customPrompt, setCustomPrompt] = useState('');

  useEffect(() => {
    onChange(projects);
  }, [projects, onChange]);

  const handleAddProject = () => {
    if (projects.length < 3) {
      setProjects([...projects, { title: '', description: '• ', link: '' }]);
    }
    setCustomPrompt('');
  };

  const formatToBulletPoints = (text) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    return lines.map(line => line.trim().startsWith('•') ? line : `• ${line}`).join('\n');
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newProjects = projects.map((project, i) =>
      i === index
        ? { ...project, [name]: name === 'description' ? formatToBulletPoints(value) : value }
        : project
    );
    setProjects(newProjects);
  };

  const handleDeleteProject = (index) => {
    if (projects.length > 1) {
      const newProjects = projects.filter((_, i) => i !== index);
      setProjects(newProjects);
    }
    setCustomPrompt('');
  };

  const handleAIRewrite = async (index, description) => {
    setLoading(prev => ({ ...prev, [index]: true }));
    setAiRewriteState(prev => ({ ...prev, [index]: { original: description, rewritten: null } }));
    setHoldInputBox(true);


    try {
      const response = await fetch('https://flask-hello-world-two-dusky.vercel.app/rewrite_project_description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_description: description,
          prompt: customPrompt || 'Rewrite the project description in bullet points format.',
        }),
      });
      const data = await response.json();
      if (!data.project_description) {
        console.error('No project description returned from AI');
        return;
      }

      const formattedBulletPoints = data.project_description.split('\n\n').map(point => `• ${point.trim()}`).join('\n');

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
    setCustomPrompt('');
  };

  const handleRejectRewrite = (index) => {
    setAiRewriteState(prev => ({ ...prev, [index]: null }));
    const newProjects = projects.map((project, i) =>
      i === index ? { ...project, description: aiRewriteState[index].original } : project
    );
    setProjects(newProjects);
    setCustomPrompt('');
  };

  const handleDescriptionKeyDown = (index, event) => {
    if (event.key === 'Enter' && event.target.selectionStart === event.target.value.length) {
      event.preventDefault();
      const newValue = event.target.value + '\n• ';
      const newProjects = projects.map((project, i) =>
        i === index ? { ...project, description: newValue } : project
      );
      setProjects(newProjects);

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
      {projects.map((project, index) => (
        <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-lg relative w-full">
          {projects.length > 1 && (
            <button
              onClick={() => handleDeleteProject(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 focus:outline-none"
              aria-label="Delete project entry"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <div>
            <label htmlFor={`title-${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Project Title</label>
            <input
              type="text"
              id={`title-${index}`}
              name="title"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Project Title"
              value={project.title}
              onChange={(e) => handleInputChange(index, e)}
              required
            />
          </div>
          <div>
            <label htmlFor={`link-${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Project Link</label>
            <input
              type="url"
              id={`link-${index}`}
              name="link"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="https://..."
              value={project.link}
              onChange={(e) => handleInputChange(index, e)}
              required
            />
          </div>
          <div>
            <label htmlFor={`description-${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description (Bullet Points)</label>
            <textarea
              id={`description-${index}`}
              onKeyDown={(e) => handleDescriptionKeyDown(index, e)}
              name="description"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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