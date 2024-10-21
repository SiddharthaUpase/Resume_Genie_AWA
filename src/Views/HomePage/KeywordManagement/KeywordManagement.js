import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getResume } from '../../../Models/resumeModel';
import DOMPurify from 'dompurify';

const KeywordManagement = ({ setPart, resume_id, keywords, setFinalKeywords }) => {
  const [relevantKeywords, setRelevantKeywords] = useState([]);
  const [irrelevantKeywords, setIrrelevantKeywords] = useState([]);
  const [matchScore, setMatchScore] = useState(0);
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const fetchResumeAndCategorize = async () => {
      try {
        const resumeData = await getResume(resume_id);
        setResume(resumeData);
        let all_terms = [];
        let relevant = [];
        let irrelevant = [];

        keywords.forEach(keyword => {
          all_terms.push(keyword.keyword);
          all_terms = all_terms.concat(keyword.related_terms);
        });

        all_terms = [...new Set(all_terms.map(term => term.toLowerCase()))];
        let split_terms = all_terms.flatMap(term => term.split(' '));
        split_terms = [...new Set(split_terms)];

        let resumeText = '';
        if (resumeData) {
          resumeText = [
            ...resumeData.workExperience.map(exp => exp.description),
            ...resumeData.education.map(edu => `${edu.college} ${edu.degree} ${edu.major}`),
            ...resumeData.projects.map(proj => proj.description),
            ...resumeData.skills.flat(2),
            ...(resumeData.customSectionData ? Object.values(resumeData.customSectionData).flat().map(sec => sec.description) : [])
          ].join(' ').toLowerCase();
        }

        //from the resume text, find and remove all the html tags
        resumeText = DOMPurify.sanitize(resumeText, { ALLOWED_TAGS: [] });

        var resumeTextArray = resumeText.split(' ');
        
        var relevantTerms = split_terms.filter(term => resumeTextArray.includes(term));

        
        var matchCount = 0;
        var totalKeywords = keywords.length;

        keywords.forEach(keyword => {
          const keywordTerms = [keyword.keyword, ...keyword.related_terms].map(term => term.toLowerCase());
          
          if (keywordTerms.some(term => 
            term.split(' ').some(word => relevantTerms.includes(word))
          )) {
            relevant.push(keyword.keyword);
            matchCount++;
            console.log(`Matched keyword: ${keyword.keyword}`);
          } else {
            irrelevant.push(keyword.keyword);
          }

        });

        var matchPercent = Math.round((matchCount / totalKeywords) * 100);
        setMatchScore(matchPercent);
        setRelevantKeywords(relevant);
        setIrrelevantKeywords(irrelevant);
      } catch (error) {
        console.error('Error fetching resume or categorizing:', error);
      }
    };

    fetchResumeAndCategorize();
  }, [resume_id, keywords]);

  const moveKeyword = (keyword, isMovingToRelevant) => {
    if (isMovingToRelevant) {
      setIrrelevantKeywords(irrelevantKeywords.filter(k => k !== keyword));
      setRelevantKeywords([...relevantKeywords, keyword]);
    } else {
      setRelevantKeywords(relevantKeywords.filter(k => k !== keyword));
      setIrrelevantKeywords([...irrelevantKeywords, keyword]);
    }
  };

  const handleSetPart = () => {
    setPart(0);
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

  const chipVariants = {
    initial: { scale: 0, opacity: 0, y: 20 },
    animate: { 
      scale: 1, opacity: 1, y: 0,
      transition: { type: "spring", stiffness: 500, damping: 25, duration: 0.4 }
    },
    exit: { 
      scale: 0, opacity: 0, y: -20,
      transition: { type: "spring", stiffness: 500, damping: 25, duration: 0.3 }
    },
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  };

  const Chip = ({ keyword, onAction, isRelevant }) => (
    <motion.div
      layout
      variants={chipVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
      whileTap="tap"
      className={`
        inline-flex items-center m-0.5 px-2 py-1 rounded-full
        shadow-md transition-colors duration-200
        ${isRelevant 
          ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:shadow-blue-200'
          : 'bg-gradient-to-r from-red-400 to-red-500 text-white hover:shadow-red-200'
        }
      `}
    >
      <span className="text-medium mr-2">{keyword}</span>
      <motion.button
        onClick={() => onAction(keyword, !isRelevant)}
        whileHover={{ 
          rotate: isRelevant ? 90 : 180,
          transition: { duration: 0.15 }
        }}
        whileTap={{ scale: 0.9 }}
        className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        {isRelevant ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        )}
      </motion.button>
    </motion.div>
  );

  return (
    <motion.div
      key="part2"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="bg-white shadow-lg rounded-xl p-8 max-w-3xl w-full flex flex-col items-start justify-center space-y-2"
      style={{ height: '80vh' }}
    >
      <h1 className="text-3xl font-bold mb-4 text-center w-full bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
        Keyword Management
      </h1>
      <button
        onClick={handleSetPart}
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

      {/* <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-200 shadow-sm"
      >
        <div className="flex items-end justify-start space-x-2">
          <div className="flex items-center space-x-2">
            <span>Temp Feature

            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-lg font-medium text-gray-700">Resume Match:</span>
          </div>
          <div className="flex items-center">
            <motion.span 
              className="text-2xl font-bold text-blue-600"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
            >
              {matchScore}%
            </motion.span>
          </div>
          <button
            onClick={() => alert('The keyword match percent is based on the relevant keywords and your resume.')}
            className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-4a1 1 0 00-1 1v2a1 1 0 102 0V7a1 1 0 00-1-1zm0 6a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </motion.div> */}
      
      <div className="w-full text-center mb-1">
        <p className="text-gray-600">

        <strong> Move</strong> keywords between categories if needed, and add relevant skills from "Additional Keywords" to your profile.
        </p>
      </div>
      
      <div className="flex w-full space-x-6">
        <div className="w-3/5 space-y-4">
          <div className="bg-blue-50 p-2 rounded-xl border-2 border-blue-200">
            <h2 className="text-md font-bold text-blue-700 mb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
              Keywords Aligning with Resume
            </h2>
            <div className="h-48 overflow-y-auto p-2 flex flex-wrap content-start">
              <AnimatePresence mode="popLayout">
                {relevantKeywords.map((keyword) => (
                  <Chip
                    key={keyword}
                    keyword={keyword}
                    onAction={moveKeyword}
                    isRelevant={true}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="w-2/5 space-y-4">
          <div className="bg-red-50 p-2 rounded-xl border-2 border-red-200">
            <h2 className="text-md font-bold text-red-700 mb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span title="Review for relevance to your experience or role">Additional Keywords ⓘ</span>
            </h2>
            <div className="h-48 overflow-y-auto p-2 flex flex-wrap content-start">
            <AnimatePresence mode="popLayout">
                {irrelevantKeywords.map((keyword) => (
                  <Chip
                    key={keyword}
                    keyword={keyword}
                    onAction={moveKeyword}
                    isRelevant={false}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => 

          {
            setFinalKeywords(relevantKeywords);
            setPart(2);
          }
        }
        className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
      >
        Continue to Next Step
      </motion.button>
    </motion.div>
  );
};

export default KeywordManagement;