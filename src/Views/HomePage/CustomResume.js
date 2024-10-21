import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getKeywords, getAllResumes,injectKeywords } from '../../Models/resumeModel';
import { motion, AnimatePresence  } from 'framer-motion';
import { data } from 'autoprefixer';
import { Key } from 'lucide-react';
import KeywordManagement from './KeywordManagement/KeywordManagement';
import SectionSelection from './KeywordManagement/SectionSelection';

const CustomResume = () => {
    const [baseResume, setBaseResume] = useState({ id: '', name: '' });
    const [jobDescription, setJobDescription] = useState('');
    const [resumeData, setResumeData] = useState([]);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isloading, setIsLoading] = useState(false);
    const [resume, setResume] = useState(null);
    const navigate = useNavigate();
    const [part, setPart] = useState(0);
    const [keywords, setKeywords] = useState([]);
    const [finalKeywords, setFinalKeywords] = useState([]); 
    const [selectedSections, setSections] = useState([]);
    const [matchPercent, setMatchPercent] = useState(0);
    const [summary, setSummary] = useState('');

    useEffect(() => {
        console.log(selectedSections)
    }, [selectedSections]);



    useEffect(() => {
        if(keywords.length > 0){
            setPart(1);
        }
    }, [keywords]);


    useEffect(() => {
        const getBaseResume = async () => {
            const user_id = localStorage.getItem('session') ? JSON.parse(localStorage.getItem('session')).user_id : null;

            try {
                const resumes = await getAllResumes(user_id);
                setResumeData(resumes);
            } catch (error) {
                console.error('Error fetching resumes:', error);
            }
        };
        getBaseResume();
    }, []);

    useEffect(() => {
        // Check if all required fields are filled
        setIsFormValid(baseResume.id !== '' && jobDescription.trim() !== '');
    }, [baseResume, jobDescription]);

    useEffect(() => {
        //clear keywords when job description changes
        setKeywords([]);
    }, [jobDescription]);

 

    const handleResumeChange = (event) => {
        const selectedId = event.target.value;
        const selectedResume = resumeData.find(resume => resume.id === selectedId);
        setBaseResume(selectedResume || { id: '', name: '' });
    };

    const handleDescriptionChange = (event) => {
        setJobDescription(event.target.value);
    };

    const get_keywords = async () => {
        try {
            const data = await getKeywords(jobDescription,
                baseResume.id
            );


            setIsLoading(false);
            const relevant = [];
            
            //jsonify the data.keywords string
            const response = data.keywords;


            setKeywords(response.keywords);
            setSummary(response.summary);

            
            
            setPart(1);
            
            

        }
        catch (error) {
            console.error('Error fetching resume:', error);
        }
    }

    const handleGetKeywords = () => {
        setIsLoading(true);
        if (isFormValid) {
            get_keywords();
        } else {
            alert("Please fill in all required fields before building the resume.");
        }
    };





    const renderParts = () => {
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
    
        switch (part) {
            case 0:
                return (
                    <motion.div
                    key="part0"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
                    className="bg-white shadow-lg rounded-xl p-8 max-w-3xl w-full flex flex-col items-start justify-center space-y-6"
                    style={{ height: '80vh' }}
                >
                        <h1 className="text-3xl font-bold mb-8 text-center w-full bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            Custom Resume Builder
                        </h1>
                        
                        <div className="w-full space-y-2">
                            <label htmlFor="baseResume" className="block text-gray-700 font-semibold text-lg">
                                Select Base Resume
                            </label>
                            <select
                                id="baseResume"
                                value={baseResume.id}
                                onChange={handleResumeChange}
                                className="block w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            >
                                <option value="">Select a resume</option>
                                {resumeData.map((resume) => (
                                    <option key={resume.id} value={resume.id}>{resume.name}</option>
                                ))}
                            </select>
                        </div>
    
                        <div className="w-full space-y-2">
                            <label htmlFor="jobDescription" className="block text-gray-700 font-semibold text-lg">
                                Job Description
                            </label>
                            <textarea
                                id="jobDescription"
                                value={jobDescription}
                                onChange={handleDescriptionChange}
                                rows="8"
                                className="block w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                placeholder="Paste the job description here..."
                            />
                        </div>
    
                        <button
                            onClick={()=>{
                                handleGetKeywords();
                            }}
                            disabled={isloading}
                            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <div className="flex items-center justify-center space-x-2">
                                {isloading && (
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                <span>{isloading ? 'Extracting Keywords...' : 'Extract High Impact Keywords'}</span>
                            </div>
                        </button>
                    </motion.div>
                );
            
                
            case 1:
                return (
                    <KeywordManagement
                        setPart={setPart}
                        resume_id={baseResume.id} // Pass the resume id
                        keywords={keywords} // Pass the array from your backend
                        setFinalKeywords={setFinalKeywords}
                    />
                );


            case 2:
                return (
                    <SectionSelection
                    setPart={setPart}
                    resumeId={baseResume.id}
                    setSections={setSections}
                    keywords={finalKeywords}
                    summary={summary}
                    />
                );

            default:
                return <h2 className="text-2xl font-bold">Select an option</h2>;
        }
    };


    return (
        <div className=" flex items-center justify-center mt-20">
            <AnimatePresence mode="wait">
                {renderParts()}
            </AnimatePresence>
        </div>
    );
};

export default CustomResume;



