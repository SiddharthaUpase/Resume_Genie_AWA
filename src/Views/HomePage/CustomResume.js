import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomResume = () => {
    const [baseResume, setBaseResume] = useState({ id: '', name: '' });
    const [jobDescription, setJobDescription] = useState('');
    const [resumeData, setResumeData] = useState([]);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isloading, setIsLoading] = useState(false);
    const [resume, setResume] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const getBaseResume = async () => {
            const user_id = localStorage.getItem('session') ? JSON.parse(localStorage.getItem('session')).user_id : null;

            try {
                const url = `https://flask-hello-world-two-dusky.vercel.app/get_all_resumes?user_id=${user_id}`;

                const response = await fetch(url);
                const data = await response.json();
                console.log(data.resumes);
                const resumeArray = data.resumes.map((resume) => ({
                    name: resume.name,
                    id: resume._id.toString()
                }));
                console.log(resumeArray);
                setResumeData(resumeArray);
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

    const handleResumeChange = (event) => {
        const selectedId = event.target.value;
        console.log("Selected value:", selectedId);
        console.log("Resume data:", resumeData);
        const selectedResume = resumeData.find(resume => resume.id === selectedId);
        console.log("Selected resume:", selectedResume);
        setBaseResume(selectedResume || { id: '', name: '' });
    };

    const handleDescriptionChange = (event) => {
        setJobDescription(event.target.value);
    };

    const getResume = async (resume_id) => {
        console.log("Resume ID:", resume_id);
        try {
            console.log(jobDescription);
            console.log(resume_id);
            const url = `https://flask-hello-world-two-dusky.vercel.app/get_resume?id=${resume_id}&job_description=${jobDescription}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            //remove the id from the resume object
            delete data.resume.id;
            data.resume.name = '';
            console.log(data.resume);
            setIsLoading(false);
            setResume(data.resume);
            navigate('/addInfo', { state: { data: data.resume } });
            return data;
        }
        catch (error) {
            console.error('Error fetching resume:', error);
        }
    }

    const handleBuildResume = () => {
        setIsLoading(true);
        if (isFormValid) {
            getResume(baseResume.id);
        } else {
            alert("Please fill in all required fields before building the resume.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
                <h1 className="text-2xl font-bold mb-6 text-center">Custom Resume Builder</h1>
                <div className="mb-4">
                    <label htmlFor="baseResume" className="block text-gray-700 font-medium mb-2">Select Base Resume:</label>
                    <select
                        id="baseResume"
                        value={baseResume.id}
                        onChange={handleResumeChange}
                        className="block w-full bg-gray-200 border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select a resume</option>
                        {resumeData.map((resume) => (
                            <option key={resume.id} value={resume.id}>{resume.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="jobDescription" className="block text-gray-700 font-medium mb-2">Job Description:</label>
                    <textarea
                        id="jobDescription"
                        value={jobDescription}
                        onChange={handleDescriptionChange}
                        rows="4"
                        cols="50"
                        className="block w-full bg-gray-200 border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                
            <div className="mb-4">
                <button
                    onClick={handleBuildResume}
                    disabled={isloading}
                    className={`w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isloading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isloading ? 'Building Resume...' : 'Build Resume'}
                </button>
            </div>
            {isloading && (
                <div className="flex justify-center mt-4">
                    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            )}

            </div>
        </div>
    );
};

export default CustomResume;