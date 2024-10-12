import React, { useEffect, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, GripVerticalIcon } from 'lucide-react';

const ExtracurricularsForm = ({ activities_parent, onChange }) => {
    const [activities, setActivities] = useState(activities_parent || []);
    const [collapsed, setCollapsed] = useState({});
    const [draggedItem, setDraggedItem] = useState(null);

    useEffect(() => {
        onChange(activities);
    }, [activities, onChange]);

    useEffect(() => {
        const initialCollapsed = {};
        activities.forEach((_, index) => {
            initialCollapsed[index] = true;
        });
        setCollapsed(initialCollapsed);
    }, []);

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        setActivities(prevActivities =>
            prevActivities.map((activity, i) => i === index ? { ...activity, [name]: value } : activity)
        );
    };

    const handleAddActivity = () => {
        setActivities(prev => [...prev, { id: Date.now(), name: '', description: '' }]);
    };

    const handleRemoveActivity = (index) => {
        setActivities(prevActivities => prevActivities.filter((_, i) => i !== index));
    };

    const handleCollapseToggle = (index) => {
        setCollapsed(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const handleDragStart = (index) => {
        setDraggedItem(index);
    };

    const handleDragOver = (index) => {
        if (draggedItem === index) return;
        const reorderedActivities = Array.from(activities);
        const [movedActivity] = reorderedActivities.splice(draggedItem, 1);
        reorderedActivities.splice(index, 0, movedActivity);
        setDraggedItem(index);
        setActivities(reorderedActivities);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
    };

    const getPreviewText = (activity) => {
        return activity.name || 'Untitled Activity';
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg border border-gray-200">
            {activities.map((activity, index) => (
                <div
                    key={activity.id}
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
                                    <h3 className="text-lg font-medium">{getPreviewText(activity)}</h3>
                                    {activity.description && (
                                        <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
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
                                onClick={() => handleRemoveActivity(index)}
                                className="text-red-500 hover:text-red-700 focus:outline-none"
                                aria-label="Remove activity"
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
                                <label htmlFor={`name-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Activity Name</label>
                                <input
                                    type="text"
                                    id={`name-${index}`}
                                    name="name"
                                    value={activity.name}
                                    onChange={(e) => handleInputChange(index, e)}
                                    className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., Basketball Team"
                                />
                            </div>

                            <div>
                                <label htmlFor={`description-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                                <textarea
                                    id={`description-${index}`}
                                    name="description"
                                    value={activity.description}
                                    onChange={(e) => handleInputChange(index, e)}
                                    rows="3"
                                    maxLength="100"
                                    className={`block w-full p-4 text-gray-900 border rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 ${
                                        activity.description.length > 100 ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Briefly describe your activity"
                                />
                                <div className="text-sm text-gray-500 mt-2">
                                    {activity.description.length}/100 characters
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            <button
                onClick={handleAddActivity}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                Add Activity
            </button>
        </div>
    );
};

export default ExtracurricularsForm;