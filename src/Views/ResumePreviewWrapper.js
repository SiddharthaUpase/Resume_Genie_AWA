import React, { useState } from 'react';
import { Plus, Minus, Settings } from 'lucide-react';
import Resume from './ResumeReview';

const ResumePreview = ({ setfullView, personalInfo, socials, education, workExperience, projects, skills, achievements, certifications, leadership, extracurriculars, summary, name, sections, keywords, customSections, customSectionData, margins, setMargins }) => {
  const [zoom, setZoom] = useState(80);
  const [isLayoutOpen, setIsLayoutOpen] = useState(false);
  
  let { margin_left, margin_right, margin_top } = margins || {};

  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 10, 10));
  };

  const handleMarginChange = (type, value) => {
    // Ensure value is between 0 and 10
    const numValue = Math.max(0, Math.min(10, parseInt(value) || 0));
    setMargins(prev => ({
      ...prev,
      [type]: numValue
    }));
  };

  return (
    <div className="md:w-2/3 h-[80vh] overflow-hidden border border-gray-300 rounded-lg shadow-md relative">
      <div className="absolute top-2 right-2 flex space-x-2">
        <button 
          onClick={handleZoomOut}
          className="p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors z-10"
          aria-label="Zoom out"
        >
          <Minus size={16} />
        </button>
        <button 
          onClick={handleZoomIn}
          className="p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors z-10"
          aria-label="Zoom in"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <div className="absolute top-2 left-2 z-10 flex space-x-2">
        <div className="relative">
          <button 
            onClick={() => setIsLayoutOpen(!isLayoutOpen)}
            className="p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors flex items-center space-x-1"
          >
            <Settings size={16} />
            <span>Layout</span>
          </button>
          
          {isLayoutOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-3 w-56">
              <h3 className="font-medium mb-3">Page Margins</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-600">Left:</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={margin_left}
                    onChange={(e) => handleMarginChange('margin_left', e.target.value)}
                    className="w-16 p-1 border rounded text-sm"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-600">Right:</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={margin_right}
                    onChange={(e) => handleMarginChange('margin_right', e.target.value)}
                    className="w-16 p-1 border rounded text-sm"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-600">Top:</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={margin_top}
                    onChange={(e) => handleMarginChange('margin_top', e.target.value)}
                    className="w-16 p-1 border rounded text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={() => setfullView(true)}
          className="p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          aria-label="Full view"
        >
          Full View
        </button>
      </div>

      <div className="w-full h-full overflow-auto flex">
        <div 
          className="transform origin-left transition-transform duration-200 ease-in-out" 
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <Resume
            previewMode={true}
            previewData={{
              personalInfo,
              socials,
              education,
              workExperience,
              projects,
              skills,
              achievements,
              certifications,
              leadership,
              extracurriculars,
              name,
              sections,
              summary,
              keywords,
              customSections,
              customSectionData,
              margins
              
            }}
          />
        </div>
      </div>
      
      {/* Click outside handler */}
      {isLayoutOpen && (
        <div 
          className="fixed inset-0 z-0"
          onClick={() => setIsLayoutOpen(false)}
        />
      )}
    </div>
  );
};

export default ResumePreview;