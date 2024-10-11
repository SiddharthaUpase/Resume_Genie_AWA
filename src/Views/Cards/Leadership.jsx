import React, { useEffect, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, GripVerticalIcon } from 'lucide-react';

const LeadershipForm = ({ leadership_parent, onChange }) => {
  const [leadership, setLeadership] = useState(
    leadership_parent || [{
      id: Date.now(),
      position: '',
      organization: '',
      startDate: '',
      endDate: '',
      description: ''
    }]
  );

  const [collapsed, setCollapsed] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    onChange(leadership);
  }, [leadership, onChange]);

  useEffect(() => {
    const initialCollapsed = {};
    leadership.forEach((_, index) => {
      initialCollapsed[index] = true;
    });
    setCollapsed(initialCollapsed);
  }, []);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    setLeadership(prevLeadership =>
      prevLeadership.map((item, i) => i === index ? { ...item, [name]: value } : item)
    );
  };

  const handleAddLeadership = () => {
    setLeadership(prev => [...prev, {
      id: Date.now(),
      position: '',
      organization: '',
      startDate: '',
      endDate: '',
      description: ''
    }]);
    setCollapsed(prev => ({ ...prev, [leadership.length]: true }));
  };

  const handleRemoveLeadership = (index) => {
    setLeadership(prevLeadership => prevLeadership.filter((_, i) => i !== index));
  };

  const handleCollapseToggle = (index) => {
    setCollapsed(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleDragStart = (index) => {
    setDraggedItem(index);
  };

  const handleDragOver = (index) => {
    if (draggedItem === index) return;
    const reorderedLeadership = Array.from(leadership);
    const [movedLeadership] = reorderedLeadership.splice(draggedItem, 1);
    reorderedLeadership.splice(index, 0, movedLeadership);
    setDraggedItem(index);
    setLeadership(reorderedLeadership);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const getPreviewText = (item) => {
    let preview = item.position;
    if (item.organization) {
      preview += ` at ${item.organization}`;
    }
    return preview || 'Untitled Leadership Experience';
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg border border-gray-200">
      {leadership.map((item, index) => (
        <div
          key={item.id}
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
                  <h3 className="text-lg font-medium">{getPreviewText(item)}</h3>
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
                onClick={() => handleRemoveLeadership(index)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
                aria-label="Remove leadership experience"
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
                <label htmlFor={`position-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Position</label>
                <input
                  type="text"
                  id={`position-${index}`}
                  name="position"
                  value={item.position}
                  onChange={(e) => handleInputChange(index, e)}
                  className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Team Lead"
                />
              </div>

              <div>
                <label htmlFor={`organization-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Organization</label>
                <input
                  type="text"
                  id={`organization-${index}`}
                  name="organization"
                  value={item.organization}
                  onChange={(e) => handleInputChange(index, e)}
                  className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Student Government"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`startDate-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Start Date</label>
                  <input
                    type="date"
                    id={`startDate-${index}`}
                    name="startDate"
                    value={item.startDate}
                    onChange={(e) => handleInputChange(index, e)}
                    className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor={`endDate-${index}`} className="block mb-2 text-sm font-medium text-gray-900">End Date</label>
                  <input
                    type="date"
                    id={`endDate-${index}`}
                    name="endDate"
                    value={item.endDate}
                    onChange={(e) => handleInputChange(index, e)}
                    className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`description-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                <textarea
                  id={`description-${index}`}
                  name="description"
                  value={item.description}
                  onChange={(e) => handleInputChange(index, e)}
                  rows="3"
                  className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Briefly describe your leadership role and accomplishments"
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleAddLeadership}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Add Leadership Experience
      </button>
    </div>
  );
};

export default LeadershipForm;