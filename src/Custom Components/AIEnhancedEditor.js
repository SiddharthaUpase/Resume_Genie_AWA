import React, { useState, useEffect } from 'react';
import { Wand2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import currentApiUrl from "../Models/apiUrl"; // Adjust the import path as needed

const AIEnhancedEditor = ({ 
    index, 
    content, 
    onContentChange, 
    label = "Content",
    linecount = 1,
    characterLimit = 0,
    isDescriptionEmpty,
    apiEndpoint = 'enhance_content', // New parameter for specifying the API endpoint
    contentType = 'general' // New parameter for specifying the content type
  }) => {
    const [activeTab, setActiveTab] = useState('generateDescription');
    const [customPrompt, setCustomPrompt] = useState('');
    const [addPointPrompt, setAddPointPrompt] = useState('');
    const [lineCount, setLineCount] = useState(linecount);
    const [charCount, setCharCount] = useState(characterLimit);
    const [animateAIRewrite, setAnimateAIRewrite] = useState(false);
    const [animationProgress, setAnimationProgress] = useState(0);
    const [descriptionGenerated, setDescriptionGenerated] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
      let animationFrame;
      if (animateAIRewrite) {
        const animate = () => {
          setAnimationProgress((prev) => {
            if (prev < 100) {
              animationFrame = requestAnimationFrame(animate);
              return prev + 2; // Decrease the increment to slow down the animation
            }
            return 100;
          });
        };
        animationFrame = requestAnimationFrame(animate);
      }
      return () => cancelAnimationFrame(animationFrame);
    }, [animateAIRewrite]);

    const handleAIRewrite = async (prompt = '') => {
      setIsGenerating(true);
      setAnimateAIRewrite(true);
      setAnimationProgress(0);

      try {
        const response = await fetch(`${currentApiUrl}/${apiEndpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: content,
            content_type: contentType,
            prompt: prompt,
            lines_count: lineCount,
            character_limit: charCount
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const enhancedContent = data.enhanced_content || data.rephrased_description;
        onContentChange(index, enhancedContent);
        setDescriptionGenerated(true);
      } catch (error) {
        console.error('Error enhancing content:', error);
      } finally {
        setIsGenerating(false);
        setTimeout(() => {
          setAnimateAIRewrite(false);
          setAnimationProgress(0);
        }, 1000);
      }
    };

    const handleAddPoint = async (customPrompt) => {
      setIsGenerating(true);
      setAnimateAIRewrite(true);
      setAnimationProgress(0);

      try {
        const response = await fetch(`${currentApiUrl}/add_point_to_description`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description: content,
            vague_statement: customPrompt
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const detailedPoint = data.detailed_point;
        onContentChange(index, content + detailedPoint);

      } catch (error) {
        console.error('Error adding point to description:', error);
      } finally {
        setIsGenerating(false);
        setTimeout(() => {
          setAnimateAIRewrite(false);
          setAnimationProgress(0);
        }, 1000);
      }
    };

    const quillStyles = `
     .quill-custom .ql-container {
         min-height: 100px;
         max-height: 400px;
         overflow-y: auto;
         border-bottom-left-radius: 8px;
         border-bottom-right-radius: 8px;
     }
     .quill-custom .ql-toolbar {
         border-top-left-radius: 8px;
         border-top-right-radius: 8px;
     }
 `;

    return (
      <div>
        <style>{quillStyles}</style>
        <label htmlFor={`content-${index}`} className="block mb-2 text-sm font-medium text-gray-900">
          {label}
        </label>
        {descriptionGenerated && (
          <div className="mb-4">
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('generateDescription')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'generateDescription' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Wand2 className="inline-block w-4 h-4 mr-1" />
                Generate Description
              </button>
              <button
                onClick={() => setActiveTab('customAIRewrite')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'customAIRewrite' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Wand2 className="inline-block w-4 h-4 mr-1" />
                Custom AI Rephrase
              </button>
              <button
                onClick={() => setActiveTab('addPoint')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'addPoint' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Wand2 className="inline-block w-4 h-4 mr-1" />
                Add Point
              </button>
            </nav>
          </div>
        )}
        <div className="mb-4 relative">
        <div className="quill-custom">
          <ReactQuill
            value={content}
            onChange={(newContent) => onContentChange(index, newContent)}
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link'],
                ['clean']
              ]
            }}
            placeholder={content.trim() === ''||'<p><br><p>' ? `Provide a brief overview of your ${contentType}, including goals, methods, and outcomes.` : ''}

          />
          {animateAIRewrite && (
            <div 
              className="absolute inset-0 bg-blue-200 opacity-30 pointer-events-none" 
              style={{ width: `${animationProgress}%`, transition: 'width 0.5s ease-out' }}
            />
          )}
        </div>
        </div>

        <div className="mt-2">
          {descriptionGenerated && activeTab === 'generateDescription' && (
            <button
              onClick={() => handleAIRewrite()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={isGenerating}
            >
             
              {isGenerating ?  <>
            <span className="inline-block w-4 h-4 mr-2 border-t-2 border-white rounded-full animate-spin"></span>
            Generating...
          </> : 
          <>
           <Wand2 className="inline-block w-4 h-4 mr-1" />
            Generate Description
          </>

          }
            </button>
          )}
          {descriptionGenerated && (activeTab === 'customAIRewrite' || activeTab === 'addPoint') && (
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder={activeTab === 'customAIRewrite' ? "Enter custom instructions to customize the description" : "In short, what's the point?"}
                className="flex-grow p-2 border rounded"
                value={activeTab === 'customAIRewrite' ? customPrompt : addPointPrompt}
                onChange={(e) => activeTab === 'customAIRewrite' ? setCustomPrompt(e.target.value) : setAddPointPrompt(e.target.value)}
              />
              <button
                onClick={() => activeTab === 'customAIRewrite' ? handleAIRewrite(customPrompt) : handleAddPoint(addPointPrompt)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                disabled={isGenerating}
              >
               
                {isGenerating ? (
          <>
            <span className="inline-block w-4 h-4 mr-2 border-t-2 border-white rounded-full animate-spin"></span>
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="inline-block w-4 h-4 mr-1" />
            {activeTab === 'customAIRewrite' ? 'AI Rephrase' : 'Add Point'}
          </>
        )}
              </button>
            </div>
          )}
          <span className="text-sm text-gray-500 mt-2 block">
            You can undo your mistakes by pressing <strong>Ctrl + Z</strong> on your keyboard, unlike in life.
          </span>
        </div>
      </div>
    );
};

export default AIEnhancedEditor;