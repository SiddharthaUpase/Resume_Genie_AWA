import React, { useState, useEffect,useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ChevronDownIcon, ChevronUpIcon, GripVerticalIcon,AlignLeftIcon,AlignJustifyIcon, Minus, MinusIcon } from 'lucide-react';
import { i } from 'framer-motion/client';
import AIEnhancedEditor from '../../Custom Components/AIEnhancedEditor';
const CustomSectionForm = ({ sectionKey, sectionName, uniqueId, data, onChange, onChangeSectionName, handleIsSingleLine }) => {
    const [items, setItems] = useState(data || []);
    const [collapsed, setCollapsed] = useState({});
    const [tempSectionName, setTempSectionName] = useState(sectionName);
    const [isSingleLine, setIsSingleLine] = useState(true);
    const [draggedItem, setDraggedItem] = useState(null);
    const quillRef = useRef({});


    
    const handleQuillChange = (index, content) => {
        const newItems = items.map((item, i) =>
            i === index ? { ...item, description: content } : item
        );
        setItems(newItems);
      };
    

    useEffect(() => {
        onChange(items);
    }, [items]);

    useEffect(() => {
        setIsSingleLine(data.isSingleLine || false);
    }, [data.isSingleLine]);
    
    useEffect(() => {
        const initialCollapsed = {};
        items.forEach((_, index) => {
            initialCollapsed[index] = true;
        });
        setCollapsed(initialCollapsed);
    }, []);

    const addItem = () => {
        setItems([...items, { id: Date.now(), title: '', description: '', startMonth: '', endMonth: '' }]);
    };

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const toggleCollapse = (index) => {
        setCollapsed(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const handleSectionNameChange = () => {
        if (tempSectionName !== "") {
            onChangeSectionName(uniqueId, tempSectionName,items);
        }
    };

    const handleLayoutChange = (isSingle) => {
        setIsSingleLine(isSingle);
        handleIsSingleLine(sectionKey, isSingle);
    };

    const handleDragStart = (index) => {
        setDraggedItem(index);
    };

    const handleDragOver = (index) => {
        if (draggedItem === index) return;
        const reorderedItems = Array.from(items);
        const [movedItem] = reorderedItems.splice(draggedItem, 1);
        reorderedItems.splice(index, 0, movedItem);
        setDraggedItem(index);
        setItems(reorderedItems);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
    };
    

    const getPreviewText = (item) => {
        let preview = item.title;
        if (item.startMonth) {
            preview += ` (${item.startMonth} - ${item.endMonth || 'Present'})`;
        }
        return preview || 'Untitled Item';
    };

    const quillModules = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            ['link'],
            [{ 'list': 'bullet' }],
        ]
    };

    const isQuillContentEmpty = (content) => {
        const strippedContent = content.replace(/<(.|\n)*?>/g, '').trim();
        return strippedContent === '';
    };


    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg border border-gray-200">
            

            <div className="mb-4">
                <input
                    type="text"
                    value={tempSectionName}
                    onChange={(e) => setTempSectionName(e.target.value)}
                    onBlur={handleSectionNameChange}
                    className="text-lg font-medium mb-4 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Section Name"
                />
            </div>

            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900">Section Type</label>
                <div className="flex items-center mb-2">
                    <button
                        onClick={() => handleLayoutChange(true)}
                        className={`mr-2 p-2 rounded ${isSingleLine ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}
                    >
                        <MinusIcon className="h-5 w-5" />
                    </button>
                    <label htmlFor={`singleLine-${uniqueId}`} className="text-sm font-medium text-gray-900">Single Line</label>
                </div>
                <div className="flex items-center">
                    <button
                        onClick={() => handleLayoutChange(false)}
                        className={`mr-2 p-2 rounded ${!isSingleLine ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}
                    >
                        <AlignLeftIcon className="h-5 w-5" />
                    </button>
                    <label htmlFor={`doubleLine-${uniqueId}`} className="text-sm font-medium text-gray-900">Double Line</label>
                </div>
            </div>

            {items.map((item, index) => (
                <div
                    key={item.id}
                    
                    className="mb-6 p-4 border border-gray-200 rounded-lg relative"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center flex-1">
                            <div className="cursor-grab mr-2"
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={() => handleDragOver(index)}
                            onDragEnd={handleDragEnd}
                            >
                                <GripVerticalIcon className="h-5 w-5 text-gray-500" />
                            </div>
                            {collapsed[index] ? (
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium">{getPreviewText(item)}</h3>
                                    
                                    {!isQuillContentEmpty(item.description) && (
                                        <p className="text-gray-600 text-sm mt-1">{item.description.substring(0, 20)}{item.description.length > 10 ? '...' : ''}</p>
                                    )}

                                </div>
                            ) : null}
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={() => toggleCollapse(index)}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none mr-2"
                            >
                                {collapsed[index] ? (
                                    <ChevronDownIcon className="h-5 w-5" />
                                ) : (
                                    <ChevronUpIcon className="h-5 w-5" />
                                )
                                }
                            </button>
                            <button
                                onClick={() => removeItem(index)}
                                className="text-red-500 hover:text-red-700 focus:outline-none"
                                aria-label="Remove item"
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
                                <label htmlFor={`title-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Title</label>
                                <input
                                    type="text"
                                    id={`title-${index}`}
                                    value={item.title}
                                    onChange={(e) => updateItem(index, 'title', e.target.value)}
                                    className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Title"
                                />
                            </div>
                            <AIEnhancedEditor
                                index={index}
                                content={item.description}
                                onContentChange={handleQuillChange}
                                label='Description'
                                linecount={1}
                                characterLimit={200}
                                isDescriptionEmpty={isQuillContentEmpty(item.description)}
                                apiEndpoint='enhance_content'
                                contentType='generic'
                            />
                            <div>
                                <label htmlFor={`startMonth-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Start Date</label>
                                <input
                                    type="month"
                                    id={`startMonth-${index}`}
                                    value={item.startMonth}
                                    onChange={(e) => updateItem(index, 'startMonth', e.target.value)}
                                    className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor={`endMonth-${index}`} className="block mb-2 text-sm font-medium text-gray-900">End Date</label>
                                <input
                                    type="month"
                                    id={`endMonth-${index}`}
                                    value={item.endMonth}
                                    onChange={(e) => updateItem(index, 'endMonth', e.target.value)}
                                    className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    )}
                </div>
            ))}

            <button
                onClick={addItem}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                Add Item
            </button>
        </div>
    );
};

export default CustomSectionForm;