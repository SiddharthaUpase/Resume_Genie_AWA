import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContext } from 'react';
import DOMPurify from 'dompurify';
import { KeywordContext } from '../../../Context/KeywordContext';


const KeywordManagement = ({ setPart, keywords_list, setFinalKeywords, jobDescription }) => {
  const [relevantKeywords, setRelevantKeywords] = useState([]);
  const [irrelevantKeywords, setIrrelevantKeywords] = useState([]);
  const [matchScore, setMatchScore] = useState(0);
  const [resume, setResume] = useState(null);
  const [frequencyMap, setFrequencyMap] = useState({});
  const [newKeyword, setNewKeyword] = useState('');
  const {
    resumeData,
    setResumeData,
    keywords,
    setKeywords,
    keywordOccurrences,
    setKeywordOccurrences,
  } = useContext(KeywordContext);
  


  

  useEffect(() => {
    const calculateKeywordFrequency = (keywords, jobDescription) => {
      // Helper function to escape special regex characters
      const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      };

      // Helper function to get plural variations
      const getPluralVariations = (term) => {
        const variations = [term];
        
        // Common plural rules
        if (term.endsWith('y')) {
          variations.push(term.slice(0, -1) + 'ies');
        } else if (term.endsWith('s') || term.endsWith('sh') || term.endsWith('ch') || term.endsWith('x') || term.endsWith('z')) {
          variations.push(term + 'es');
        } else {
          variations.push(term + 's');
        }

        return variations;
      };

      // Helper function to count matches based on keyword type
      const countMatches = (term, text) => {
        if (!text) return 0; // Guard against undefined text
        
        const cleanText = text.toLowerCase();
        const cleanTerm = term.toLowerCase();

        // Handle special cases
        const isAbbreviation = term === term.toUpperCase() && term.length > 1;
        const isCompoundWord = term.includes('-') || term.includes(' ');

        let count = 0;

        if (isAbbreviation) {
          // For abbreviations like "API", "CSS", etc.
          const variations = getPluralVariations(cleanTerm);
          variations.forEach(variant => {
            const abbrRegex = new RegExp(`\\b${escapeRegExp(variant)}\\b|\\.${escapeRegExp(variant)}\\.?\\b`, 'gi');
            const matches = cleanText.match(abbrRegex);
            count += matches ? matches.length : 0;
          });
        } else if (isCompoundWord) {
          // For compound words or hyphenated terms
          const parts = cleanTerm.split(/[\s-]+/);
          
          // Handle plural for the last part of compound words
          const baseParts = [...parts];
          const lastPart = baseParts[baseParts.length - 1];
          const pluralVariations = getPluralVariations(lastPart);
          
          pluralVariations.forEach(variant => {
            const modifiedParts = [...baseParts];
            modifiedParts[modifiedParts.length - 1] = variant;
            
            const compoundRegex = new RegExp(`\\b${modifiedParts.map(part => escapeRegExp(part)).join('[\\s-]+')}\\b`, 'gi');
            const matches = cleanText.match(compoundRegex);
            count += matches ? matches.length : 0;
          });
        } else {
          // For regular words
          const variations = getPluralVariations(cleanTerm);
          
          variations.forEach(variant => {
            const wordRegex = new RegExp(`\\b${escapeRegExp(variant)}\\b`, 'gi');
            const matches = cleanText.match(wordRegex);
            count += matches ? matches.length : 0;

            const hyphenatedRegex = new RegExp(`\\b${escapeRegExp(variant.replace(/\s+/g, '-'))}\\b`, 'gi');
            const hyphenatedMatches = cleanText.match(hyphenatedRegex);
            count += hyphenatedMatches ? hyphenatedMatches.length : 0;
          });
        }

        return count;
      };

      // Process each keyword
      const keywordFrequency = keywords.map(keyword => {
        const frequency = countMatches(keyword.keyword, jobDescription);
        return { keyword, frequency };
      });

      // Sort by frequency in descending order
      keywordFrequency.sort((a, b) => b.frequency - a.frequency);
      

      // Extract just the keywords
      const keywordFrequencyArray = keywordFrequency.map((item) => item.keyword);
      
      setFrequencyMap(keywordFrequency);
      // Update state
      setKeywords(keywordFrequencyArray);
      
      return keywordFrequency;
    };

    // Only run if we have keywords_list and jobDescription
    if (keywords_list && keywords_list.length > 0) {
      calculateKeywordFrequency(keywords_list, jobDescription);
    }
  }, [keywords_list, jobDescription]); // Dependencies array




  useEffect(() => {
    const fetchResumeAndCategorize = async () => {
      try {
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
  }, [keywords]);

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

  const handleKeywordSubmit = (e) => {
    e.preventDefault();
    if (newKeyword.trim()) {
      // Check if keyword already exists in either list
      const keywordExists = [...relevantKeywords, ...irrelevantKeywords].some(
        k => k.toLowerCase() === newKeyword.trim().toLowerCase()
      );

      if (!keywordExists) {
        setRelevantKeywords(prev => [...prev, newKeyword.trim()]);
        // Add to frequency map with 0 frequency
        setFrequencyMap(prev => [
          ...prev,
          { 
            keyword: { keyword: newKeyword.trim() }, 
            frequency: 0 
          }
        ]);
      }
      setNewKeyword('');
    }
  };

  const Chip = ({ keyword, onAction, isRelevant }) => {
    const frequency = frequencyMap.find(item => item.keyword.keyword === keyword)?.frequency || 0;
    const isTop10Percent = frequencyMap.findIndex(item => item.keyword.keyword === keyword) < Math.ceil(frequencyMap.length * 0.2);

    return (
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
            : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:shadow-yellow-200'
          }
        `}
      >
        <span className="text-medium mr-2">
          {keyword} {isTop10Percent && `(${frequency})`} 
          {
            isTop10Percent && (
              <span className="text-yellow-400">★</span>)
          }
          
        </span>
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
  };
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
      
      <div className="w-full text-center mb-1">
        <p className="text-gray-600">

        <strong> Pick</strong> keywords from the list below and add the relevant ones.
        </p>
      </div>
      <form onSubmit={handleKeywordSubmit} className="w-full">
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="Type a new keyword and press Enter"
            className="flex-1 px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add
          </motion.button>
        </div>
      </form>
      
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
          <div className="bg-yellow-50 p-2 rounded-xl border-2 border-yellow-200">
            <h2 className="text-md font-bold text-yellow-700 mb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span title="Review for relevance to your experience or role">High Impact Keywords ⓘ</span>
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