import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import Resume from './ResumeReview';

const ResumePreview = (  {setfullView, personalInfo, socials, education, workExperience, projects, skills, achievements, certifications,  leadership, extracurriculars, name, sections, keywords}) => {
  const [zoom, setZoom] = useState(80);

  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 10, 10));
    //print the zoom value
    console.log(zoom);
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
      <div className="absolute top-2 left-2 z-10">
        <button 
          onClick={() => setfullView(true)}
          className="p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors "
          aria-label="Full view"
        >
          Full View
        </button>
        </div>

      <div className="w-full h-full overflow-auto flex ">
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
              keywords
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;