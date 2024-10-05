import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, GripVertical } from 'lucide-react';

const Socials = ({ social_info, onChange }) => {
    const initialSocials = Array.isArray(social_info) ? social_info : [];
    const [socials, setSocials] = useState(initialSocials);
    const [newPlatform, setNewPlatform] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);

    useEffect(() => {
        setSocials(Array.isArray(social_info) ? social_info : []);
    }, [social_info]);

    const handleChange = (index, key, value) => {
        const updatedSocials = socials.map((item, i) => 
            i === index ? { ...item, [key]: value } : item
        );
        setSocials(updatedSocials);
        onChange(updatedSocials);
    };

    const handleAddPlatform = () => {
        if (newPlatform && !socials.some(({ platform }) => platform === newPlatform)) {
            const updatedSocials = [...socials, { platform: newPlatform, url: '' }];
            setSocials(updatedSocials);
            onChange(updatedSocials);
            setNewPlatform('');
        }
    };

    const handleDragStart = (e, index) => {
        setDraggedItem(index);
        e.currentTarget.style.opacity = '0.4';
    };

    const handleDragEnd = (e) => {
        e.currentTarget.style.opacity = '1';
        setDraggedItem(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, index) => {
        e.preventDefault();
        const newSocials = [...socials];
        const draggedItemContent = newSocials[draggedItem];
        newSocials.splice(draggedItem, 1);
        newSocials.splice(index, 0, draggedItemContent);
        setSocials(newSocials);
        onChange(newSocials);
        setDraggedItem(null);
    };

    return (
        <div className="flex flex-col space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-blue-900">Social Platforms</h2>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newPlatform}
                        onChange={(e) => setNewPlatform(e.target.value)}
                        placeholder="Add new platform"
                        className="px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <button
                        onClick={handleAddPlatform}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <Plus size={18} className="mr-2" />
                        Add
                    </button>
                </div>
            </div>

            {/* Social Platforms List */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-100">
                {/* Column Headers */}
                <div className="flex items-center px-6 py-3 bg-blue-50 border-b border-blue-100 rounded-t-xl">
                    <div className="w-8"></div> {/* Space for drag handle */}
                    <div className="w-1/3 font-medium text-blue-900">Platform</div>
                    <div className="w-2/3 font-medium text-blue-900">URL</div>
                    <div className="w-16"></div>
                </div>
                
                {/* List Items */}
                <ul className="divide-y divide-blue-100">
                    {socials.map(({ platform, url }, index) => (
                        <li 
                            key={index} 
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            className={`flex items-center px-6 py-4 hover:bg-blue-50 transition-colors ${draggedItem === index ? 'opacity-40' : ''}`}
                        >
                            <div className="w-8 cursor-move">
                                <GripVertical size={18} className="text-blue-300" />
                            </div>
                            <div className="w-1/3 pr-4">
                                {editingIndex === index ? (
                                    <input
                                        type="text"
                                        value={platform}
                                        onChange={(e) => handleChange(index, 'platform', e.target.value)}
                                        onBlur={() => setEditingIndex(null)}
                                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        autoFocus
                                    />
                                ) : (
                                    <div 
                                        onClick={() => setEditingIndex(index)}
                                        className="flex items-center cursor-pointer group"
                                    >
                                        <span className="text-blue-900">{platform}</span>
                                        <Edit2 size={14} className="ml-2 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                )}
                            </div>
                            <div className="w-2/3">
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => handleChange(index, 'url', e.target.value)}
                                    placeholder="https://"
                                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="w-16 flex justify-end">
                                <button
                                    onClick={() => {
                                        const updatedSocials = socials.filter((_, i) => i !== index);
                                        setSocials(updatedSocials);
                                        onChange(updatedSocials);
                                    }}
                                    className="p-2 text-blue-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                
                {socials.length === 0 && (
                    <div className="px-6 py-8 text-center text-blue-400">
                        No social platforms added yet. Add your first one above!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Socials;