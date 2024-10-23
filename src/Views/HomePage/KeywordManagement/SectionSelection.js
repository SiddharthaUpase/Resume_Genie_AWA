import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getResume } from '../../../Models/resumeModel';
import { injectKeywords } from '../../../Models/resumeModel';
import { json, useNavigate } from 'react-router-dom';
import { data } from 'autoprefixer';



const SectionSelection = ({ setPart, resumeId, keywords, setSections,summary }) => {
  const [resume, setResume] = useState(null);
  const [selectedSections, setSelectedSections] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const resumeData = await getResume(resumeId);
        setResume(resumeData);
      } catch (error) {
        console.error('Error fetching resume:', error);
      }
    };

    fetchResume();
  }, [resumeId]);

 

  const handleInjectKeywords = async () => {
    setIsLoading(true);
    try {
      const response = await injectKeywords(resume, selectedSections, keywords, summary);
      const enhancedResume = response.enhanced_resume;
      
      // Parse the JSON strings in the response
      const parsedData = {};
      for (let section in enhancedResume) {
        try {
          parsedData[section] = JSON.parse(enhancedResume[section]);
        } catch (error) {
          console.error(`Error parsing ${section}:`, error);
          parsedData[section] = enhancedResume[section]; // Keep original if parsing fails
        }
      }
  
      // Update the resume data with the parsed content
      for (let section in parsedData) {
        // Handle main sections
        if (resume[section]) {
          resume[section].forEach((item, index) => {
            if (parsedData[section][index]) {
              item.description = parsedData[section][index].description;
            }
          });
        } 
        // Handle custom sections
        else if (resume.customSectionData) {
          for (let customSection in resume.customSectionData) {
            if (customSection === section) {
              resume.customSectionData[customSection].forEach((item, index) => {
                if (parsedData[section][index]) {
                  item.description = parsedData[section][index].description;
                }
              });
            }
          }
        }
      }
      resume.keywords = keywords;
      resume.name = resume.name + ' Enhanced';
      resume.id = null; // Clear the ID to create a new resume
      setResume({...resume}); // Create a new object reference to trigger re-render
      setIsLoading(false);

      handleNavigate();
    } catch (error) {
      console.error('Error processing keywords:', error);
      setIsLoading(false);
    }
  };

  const handleNavigate = () => {

    const data = resume;
        //navigate to the add info page with the updated resume
        navigate('/addInfo', { state: { data } });
    };


  const handleSectionToggle = (section) => {
    setSelectedSections(prevSelected =>
      prevSelected.includes(section.name)
        ? prevSelected.filter(name => name !== section.name)
        : [...prevSelected, section.name]
    );
  };

  const handleContinue = () => {
    setSections(selectedSections);

  };

  const pageVariants = {
    initial: { x: 200, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -200, opacity: 0 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.25
  };

  if (!resume) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      key="sectionSelection"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="bg-white shadow-lg rounded-xl p-8 max-w-3xl w-full flex flex-col items-start justify-center space-y-6"
      style={{ height: '80vh' }}
    >
      <h1 className="text-3xl font-bold mb-4 text-center w-full bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
        Select Sections for Keyword Injection
      </h1>
      
      <button
        onClick={() => setPart(1)}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back</span>
      </button>

      <div className="w-full space-y-4">
        <p className="text-gray-600">
          Select the sections where you want to inject the keywords:
        </p>
        <div className="space-y-2">

        {resume.sections.map((section) => (
            section.name !== 'Personal Info' && section.name !== 'Socials' && section.name !== 'Education' && (
                <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center space-x-2"
                >
                    <input
                        type="checkbox"
                        id={`section-${section.id}`}
                        checked={selectedSections.includes(section.name)}
                        onChange={() => handleSectionToggle(section)}
                        className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                    />
                    <label htmlFor={`section-${section.id}`} className="text-gray-700">
                        {section.emoji} {section.name}
                    </label>
                </motion.div>
            )
        ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleInjectKeywords}
        disabled={selectedSections.length === 0 || isloading}
        className={`w-full py-3 px-6 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 ${
          selectedSections.length === 0 || isloading
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
            : 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600'
        }`}
      >
        {isloading ? (
          <svg
            className="animate-spin h-5 w-5 text-white mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          'Inject Keywords'
        )}
      </motion.button>
    </motion.div>
  );
};

export default SectionSelection;