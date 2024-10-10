import React, { useEffect, useState } from 'react';
import { rewriteAchievement } from '../../Models/addInfoModels';
import { ChevronDownIcon, ChevronUpIcon, GripVerticalIcon } from 'lucide-react';
import { use } from 'framer-motion/client';

const AchievementsForm = ({ achievements_parent, onChange }) => {
  const [achievements, setAchievements] = useState(
    achievements_parent || []
  );

  const [loading, setLoading] = useState({});
  const [aiRewriteState, setAiRewriteState] = useState({});
  const [holdInputBox, setHoldInputBox] = useState({});
  const [collapsed, setCollapsed] = useState({});  
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    onChange(achievements);
  }, [achievements, onChange]);

  useEffect(() => {
    // Initialize collapsed state to false for each achievement
    const initialCollapsed = {};
    achievements.forEach((_, index) => {
      initialCollapsed[index] = true;
    });

    setCollapsed(initialCollapsed);
  }, [ ]);



  const handleAIrewrite = async (index, achievement) => {
    setLoading(prev => ({ ...prev, [index]: true }));
    setAiRewriteState(prev => ({ ...prev, [index]: { original: achievement.description, rewritten: null } }));
    setHoldInputBox(prev => ({ ...prev, [index]: true }));

    try {
      const response = await rewriteAchievement(achievement.description);

      const newAchievement = response;
      if(!newAchievement) {
        console.error('No achievement returned from AI');
        return;
      }

      setAiRewriteState(prev => ({ 
        ...prev, 
        [index]: { ...prev[index], rewritten: newAchievement } 
      }));
      
      setLoading(prev => ({ ...prev, [index]: false }));
      setHoldInputBox(prev => ({ ...prev, [index]: false }));
      const newAchievements = achievements.map((achievement, i) =>
        i === index ? { ...achievement, description: newAchievement } : achievement
      );
      setAchievements(newAchievements);
    } catch (error) {
      console.error('Fetch error:', error);
      setLoading(prev => ({ ...prev, [index]: false }));
      setHoldInputBox(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleAcceptRewrite = (index) => {
    setAchievements(prevAchievements =>
      prevAchievements.map((achievement, i) => 
        i === index ? { ...achievement, description: aiRewriteState[index].rewritten } : achievement
      )
    );
    setAiRewriteState(prev => ({ ...prev, [index]: null }));
  };

  const handleRejectRewrite = (index) => {
    setAiRewriteState(prev => ({ ...prev, [index]: null }));
    setAchievements(prevAchievements =>
      prevAchievements.map((achievement, i) => 
        i === index ? { ...achievement, description: aiRewriteState[index].original } : achievement
      )
    );
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    setAchievements(prevAchievements =>
      prevAchievements.map((achievement, i) => i === index ? { ...achievement, [name]: value } : achievement)
    );
  };

  const handleAddAchievement = () => {
    setAchievements(prev => [...prev, { id: Date.now(), title: '', description: '', date: '' }]);
  };

  const handleRemoveAchievement = (index) => {
    setAchievements(prevAchievements => prevAchievements.filter((_, i) => i !== index));
  };

  const handleCollapseToggle = (index) => {
    setCollapsed(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleDragStart = (index) => {
    setDraggedItem(index);
  };

  const handleDragOver = (index) => {
    if (draggedItem === index) return;
    const reorderedAchievements = Array.from(achievements);
    const [movedAchievement] = reorderedAchievements.splice(draggedItem, 1);
    reorderedAchievements.splice(index, 0, movedAchievement);
    setDraggedItem(index);
    setAchievements(reorderedAchievements);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const getPreviewText = (achievement) => {
    let preview = achievement.title;
    if (achievement.date) {
      preview += ` (${new Date(achievement.date).toLocaleDateString()})`;
    }
    return preview || 'Untitled Achievement';
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg border border-gray-200">
      {achievements.map((achievement, index) => (
        <div
          key={achievement.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={() => handleDragOver(index)}
          onDragEnd={handleDragEnd}
          className="mb-6 p-4 border border-gray-200 rounded-lg relative"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center flex-1">
              <div className="cursor-grab mr-2">
                <GripVerticalIcon className="h-5 w-5 text-gray-500" />
              </div>
              {collapsed[index] ? (
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{getPreviewText(achievement)}</h3>
                  {achievement.description && (
                    <p className="text-gray-600 text-sm mt-1">{achievement.description}</p>
                  )}
                </div>
              ) : null}
            </div>
            <div className="flex items-center">
              <button
                onClick={() => handleCollapseToggle(index)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none mr-2"
              >
                {collapsed[index] ? (
                  <ChevronDownIcon className="h-5 w-5" />
                ) : (
                  <ChevronUpIcon className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => handleRemoveAchievement(index)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
                aria-label="Remove achievement"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {!collapsed[index] && (
            <div className="space-y-4">
              <div>
                <label htmlFor={`title-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Achievement Title</label>
                <input
                  type="text"
                  id={`title-${index}`}
                  name="title"
                  value={achievement.title}
                  onChange={(e) => handleInputChange(index, e)}
                  className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., First Place in Coding Competition"
                />
              </div>

              <div>
                <label htmlFor={`description-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                <textarea
                  id={`description-${index}`}
                  name="description"
                  value={aiRewriteState[index]?.rewritten || achievement.description}
                  onChange={(e) => handleInputChange(index, e)}
                  rows="3"
                  maxLength="100"
                  className={`block w-full p-4 text-gray-900 border rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 ${
                    achievement.description.length > 100 ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Briefly describe your achievement"
                  style={{ backgroundColor: aiRewriteState[index]?.rewritten ? '#A2FFA7' : 'white' }}
                  disabled={holdInputBox[index]}
                />
                <div className="flex justify-between items-center mt-2">
                  <button
                    onClick={() => handleAIrewrite(index, achievement)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    disabled={loading[index] || aiRewriteState[index]?.rewritten}
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
                  <div className="text-sm text-gray-500">
                    {achievement.description.length}/100 characters
                  </div>
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

              <div>
                <label htmlFor={`date-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Date of Achievement</label>
                <input
                  type="date"
                  id={`date-${index}`}
                  name="date"
                  value={achievement.date}
                  onChange={(e) => handleInputChange(index, e)}
                  className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleAddAchievement}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Add Achievement
      </button>
    </div>
  );
};

export default AchievementsForm;