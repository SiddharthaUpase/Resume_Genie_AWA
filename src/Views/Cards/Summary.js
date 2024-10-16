import React, { useEffect, useState } from 'react';
import { rewriteSummary, customRewriteSummary } from '../../Models/addInfoModels';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Wand2, PenLine, Check, X } from 'lucide-react';
import AIEnhancedEditor from '../../Custom Components/AIEnhancedEditor';

const SummaryForm = ({ summary_parent, onChange }) => {
    const [summary, setSummary] = useState(summary_parent || '');
    const [loading, setLoading] = useState(false);
    const [aiRewriteState, setAiRewriteState] = useState(null);
    const [customPrompt, setCustomPrompt] = useState('');
    const [activeTab, setActiveTab] = useState('complete');

    useEffect(() => {
        onChange(summary);
    }, [summary, onChange]);

    const editorStyle = {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        transition: 'border-color 0.3s',
        height: '200px',
    };



    const handleInputChange = (index,value) => {
        console.log(value);
        setSummary(value);
    };
    const isDescriptionEmpty = (description) => {
        return description === '' || description === '<p><br></p>';
    };


     // Custom CSS to target the ReactQuill editor
     const quillStyles = `
     .quill-custom .ql-container {
         height: 120px;
         border-bottom-left-radius: 8px;
         border-bottom-right-radius: 8px;
         background-color: ${aiRewriteState?.rewritten ? '#A2FFA7' : 'white'};
     }
     .quill-custom .ql-toolbar {
         border-top-left-radius: 8px;
         border-top-right-radius: 8px;
     }
 `;

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
            <style>{quillStyles}</style>
            <div className="mb-6 p-4  rounded-lg relative">
            <div className="z-50">
                <AIEnhancedEditor
                        index={1}
                        label="Summary"
                        content={summary}
                        onContentChange={handleInputChange}
                        isDescriptionEmpty={isDescriptionEmpty(summary)}
                        
                        linecount={4}
                        characterLimit={200}
                        apiEndpoint='enhance_content'
                        contentType="summary"

                />
              </div>
            </div>
        </div>
    );
};

export default SummaryForm;