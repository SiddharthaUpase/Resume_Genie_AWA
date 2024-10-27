import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import PersonalInfo from '../AddInfoPage/Cards/PersonalInfo';
import WorkExperience from '../AddInfoPage/Cards/WorkExperience';
import Projects from '../AddInfoPage/Cards/Projects';
import Socials from '../AddInfoPage/Cards/Socials';
import Education from '../AddInfoPage/Cards/Education';
import MultiFieldSkillsForm from '../AddInfoPage/Cards/Skills';
import Resume from '../ResumeReview';
import { useLocation } from 'react-router-dom';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { useRef } from 'react';
import Section from './SideBar Sections/Section';
import ResumePreview from '../ResumePreviewWrapper';
import { storeResume } from '../../Models/addInfoModels';
import KeywordsDialog from './KeywordsDialog';
import { ProgressInfoContext} from '../../Context/ProgressInfoContext'; 
import { useResume } from '../../Context/ResumeContext';
import CustomSectionForm from '../AddInfoPage/Cards/CustomSection';
import { s } from 'framer-motion/client';




const AddInfoPage = ({ }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentSection, setCurrentSection] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        console.log('Current Section was changed', currentSection);
    }, [currentSection]);



    const [personalInfo, setPersonalInfo] = useState({ first_name: '', last_name: '', email: '', phone: '', location: '' });
    const [socials, setSocials] = useState([
        { platform: 'linkedin', url: '' },
        { platform: 'github', url: '' },
        { platform: 'portfolio', url: '' }
    ]);
        const [education, setEducation] = useState([{ college: '', degree: '', startDate: '', endDate: '', courses: [], gpa: '', major: '', minor: '', location: '' }]);
    const [workExperience, setWorkExperience] = useState([{ jobTitle: '', company: '', startDate: '', endDate: '', description: '', location: '' }]);
    const [projects, setProjects] = useState([{ title: '', description: '', link: '' }]);
    const [skills, setSkills] = useState([]);
    const [id, set_id] = useState('');
    const [achievements, setAchievements] = useState([{ title: '', description: '', date: '' }]);
    const [certifications, setCertifications] = useState([{
      name: '', 
      issuer: '', 
      dateObtained: '', 
      expirationDate: '', 
      credentialID: '', 
      credentialURL: '',
      description: ''
    }]);
    const [leadership, setLeadership] = useState([{ 
        position: '', 
        organization: '', 
        startDate: '', 
        endDate: '', 
        description: '' 
      }]);
    const [extracurriculars, setExtracurriculars] = useState(['']); //list of strings
    const [summary, setSummary] = useState('');
    const emojis = ['😕', '🤨', '😐', ' 🙂', ' 😃', '😎','🤩'];
    const [middleWidth, setMiddleWidth] = useState(1000);
    const {progressInfo, setProgressInfo}= useContext(ProgressInfoContext);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [saved, setSaved] = useState(false);
    const [name, setName] = useState('');
    const [showNameWarning, setShowNameWarning] = useState(false);
    const [fullView, setfullView] = useState(false);
    const [sections, setSections] = useState([
    { id: 0, name: 'Personal Info', emoji: '🧞' },
    { id: 1, name: 'Socials', emoji: '🧑‍💻' },
    { id: 2, name: 'Education', emoji: '🎓' },
    { id: 3, name: 'Work Exp.', emoji: '👔' },
    { id: 4, name: 'Projects', emoji: '🚀' },
    { id: 5, name: 'Skills', emoji: '🔧' },]);
    const currentSectionData = sections[currentSection];
    
    const [keywords, setKeywords] = useState([]);
    const [jobDescription, setJobDescription] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openDialog = () => setIsDialogOpen(true);
    const closeDialog = () => setIsDialogOpen(false);

    const { resumeState} = useResume();

    const [customSections, setCustomSections] = useState([]);
    const [customSectionData, setCustomSectionData] = useState({});
    const [margins, setMargins] = useState({ margin_left: 4, margin_right: 4, margin_top: 1 });

    const addCustomSection = (sectionName) => {
        const newSection = {
            id: sections.length,
            section_id: Date.now(),
            name: sectionName,
            emoji: '⚙️', // Default emoji for custom sections
            isCustom: true,
            singleLine: false,
        };
        setSections([...sections, newSection]);
        setCustomSections([...customSections, newSection]);
        setCustomSectionData({...customSectionData, [sectionName]: []});
        setCurrentSection(sections.length);
    };

const handleCustomSectionChange = (sectionName, data) => {
    
    setCustomSectionData(prevData => ({
        ...prevData,
        [sectionName]: data
    }));
};




// Effect to calculate and update the progress percentage
useEffect(() => {
    const totalFields = Object.keys(progressInfo.filledStatus).length;
    const filledFields = Object.values(progressInfo.filledStatus).filter(value => value).length;
    const percentage = Math.round((filledFields / totalFields) * 100);
    setProgressInfo(prevState => ({
        ...prevState,
        progressPercentage: percentage,
        sectionsfilled: filledFields
    }));
}, [progressInfo.filledStatus]);

    useEffect(() => {
        const isPersonalInfoFilled = personalInfo.first_name !== '' ||
            personalInfo.last_name !== '' ||
            personalInfo.email !== '' ||
            personalInfo.phone !== '' ||
            personalInfo.location !== '';

        setProgressInfo(prevState => ({
            ...prevState,
            filledStatus: {
                ...prevState.filledStatus,
                personalInfo: isPersonalInfoFilled
            }
        }));
    }, [personalInfo]);

    useEffect(() => {
        const isSocialsFilled = socials.some(social =>  social.url !== '');

        setProgressInfo(prevState => ({
            ...prevState,
            filledStatus: {
                ...prevState.filledStatus,
                socials: isSocialsFilled
            }
        }));
    }, [socials]);

    useEffect(() => {
        const isEducationFilled = education.some(edu => edu.college !== '' || edu.degree !== '' || edu.startDate !== '' || edu.endDate !== '' || edu.courses.length > 0 || edu.gpa !== '' || edu.major !== '' || edu.minor !== '' || edu.location !== '');

        setProgressInfo(prevState => ({
            ...prevState,
            filledStatus: {
                ...prevState.filledStatus,
                education: isEducationFilled
            }
        }));
    }, [education]);

    useEffect(() => {
        const isWorkExperienceFilled = workExperience.some(work => work.jobTitle !== '' || work.company !== '' || work.startDate !== '' || work.endDate !== '' || work.description !== '' || work.location !== '');

        setProgressInfo(prevState => ({
            ...prevState,
            filledStatus: {
                ...prevState.filledStatus,
                workExperience: isWorkExperienceFilled
            }
        }));
    }, [workExperience]);

    useEffect(() => {
        const isProjectsFilled = projects.some(project => project.title !== '' || project.description !== '' || project.link !== '');

        setProgressInfo(prevState => ({
            ...prevState,
            filledStatus: {
                ...prevState.filledStatus,
                projects: isProjectsFilled
            }
        }));
    }, [projects]);

    useEffect(() => {
        const isSkillsFilled = skills.length > 0;

        setProgressInfo(prevState => ({
            ...prevState,
            filledStatus: {
                ...prevState.filledStatus,
                skills: isSkillsFilled
            }
        }));
    }, [skills]);


    useEffect(() => {
        // Handler for browser back button
        const handlePopState = (event) => {
            console.log('Back button pressed');
            // Prevent the default back action
            event.preventDefault();
            
            if (!saved) {
                setShowConfirmDialog(true);
            } else {
                // If everything is saved, allow navigation
                navigate('/home');
            }
        };

        // Push an initial entry to the history stack
        window.history.pushState(null, '', window.location.pathname);

        // Add event listener for popstate
        window.addEventListener('popstate', handlePopState);

        // Cleanup function
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [saved, navigate]); // Dependencies array includes saved state and navigate function


const saveRetryCount = useRef(0);

    //create an endpoin to post the resume data
    const postResume = async (data) => {
        const storedSession = JSON.parse(localStorage.getItem("session"));
        const newResume = {
            user_id: storedSession.user_id,
            resume_data: data,
            status: 'draft',
            name: name
        };

        setIsLoading(true);
        
        try {
            const response = await storeResume(newResume,set_id);
            setSaved(true);
            //if saved in the first attempt reset the retry count
            saveRetryCount.current = 0;
            
            setIsLoading(false);


        } catch (error) {
            console.error('Fetch error:', error);
            //call the post resume function again if the save fails
            if (saveRetryCount.current < 3) {
                saveRetryCount.current += 1;
                postResume(data);
                console.log('Retrying save:', saveRetryCount.current);
            }
            else {
                alert('Failed to save resume data');
            }


        }
    };

    useEffect(() => {
        const currentData = localStorage.getItem('current_resume_data');
    
        if (currentData) {
            const data = JSON.parse(currentData);
            console.log('Loading from Current Data:', data);
            setKeywords(data.keywords || []);
            setJobDescription(data.jobDescription || '');
            setPersonalInfo(data.personalInfo || { first_name: '', last_name: '', email: '', phone: '', location: '' });
            setSocials(Array.isArray(data.socials) ? data.socials : [
                { platform: 'linkedin', url: '' },
                { platform: 'github', url: '' },
                { platform: 'portfolio', url: '' }
            ]);
            setEducation(data.education || []);
            setWorkExperience(data.workExperience || []);
            setProjects(data.projects || []);
            setSkills(data.skills || []);
            setAchievements(data.achievements || []);
            setName(data.name || '');
            setCertifications(data.certifications || []);
            setLeadership(data.leadership || []);
            setExtracurriculars(data.extracurriculars || []);
            setSummary(data.summary || '');
            setMargins(data.margins || { margin_left: 4, margin_right: 4, margin_top: 1 });
            
            // Important: Load sections before custom sections
            if (data.sections && Array.isArray(data.sections)) {
                setSections(data.sections);
            }
            
            if (data.customSections) {
                setCustomSections(data.customSections);
                setCustomSectionData(data.customSectionData || {});
            }
            set_id(data.id || '');
    
        } else if (location.state && location.state.data) {
            const data = location.state.data;
            setKeywords(data.keywords || []);
            setJobDescription(data.jobDescription || '');
            setPersonalInfo(data.personalInfo || { first_name: '', last_name: '', email: '', phone: '', location: '' });
            setSocials(Array.isArray(data.socials) ? data.socials : [
                { platform: 'linkedin', url: '' },
                { platform: 'github', url: '' },
                { platform: 'portfolio', url: '' }
            ]);
            setEducation(data.education || []);
            setWorkExperience(data.workExperience || []);
            setProjects(data.projects || []);
            setSkills(data.skills || []);
            setName(data.name || '');
            setSummary(data.summary || '');
            setMargins(data.margins || { margin_left: 4, margin_right: 4, margin_top: 1 });
            
            // Important: Load sections before custom sections
            if (data.sections && Array.isArray(data.sections)) {
                setSections(data.sections);
            } else {
                setSections([
                    { id: 0, name: 'Personal Info', emoji: '🧞' },
                    { id: 1, name: 'Socials', emoji: '🧑‍💻' },
                    { id: 2, name: 'Education', emoji: '🎓' },
                    { id: 3, name: 'Work Exp.', emoji: '👔' },
                    { id: 4, name: 'Projects', emoji: '🚀' },
                    { id: 5, name: 'Skills', emoji: '🔧' },
                ]);
            }
            
            if (data.customSections) {
                setCustomSections(data.customSections);
                setCustomSectionData(data.customSectionData || {});
            } else {
                setCustomSections([]);
                setCustomSectionData({});
            }
            
            set_id(data.id || '');
        } else {
            // Initialize with default values
            console.log('No data found, initializing with defaults');
            setJobDescription('');
            setKeywords([]);
            setPersonalInfo({ first_name: '', last_name: '', email: '', phone: '', location: '' });
            setSocials([
                { platform: 'linkedin', url: '' },
                { platform: 'github', url: '' },
                { platform: 'portfolio', url: '' }
            ]);
            setEducation([]);
            setWorkExperience([]);
            setProjects([]);
            setSkills([]);
            setName('');
            setSummary('');
            setCustomSectionData({});
            setCustomSections([]);
            setMargins({ margin_left: 4, margin_right: 4, margin_top: 1 });
            setSections([
                { id: 0, name: 'Personal Info', emoji: '🧞' },
                { id: 1, name: 'Socials', emoji: '🧑‍💻' },
                { id: 2, name: 'Education', emoji: '🎓' },
                { id: 3, name: 'Work Exp.', emoji: '👔' },
                { id: 4, name: 'Projects', emoji: '🚀' },
                { id: 5, name: 'Skills', emoji: '🔧' },
            ]);
            set_id('');
        }
    }, []);


    //create useeffect to savea copy at eny point and if any changes are made to the data turn the saved to false

    useEffect(() => {

        setSaved(false);
    }, [personalInfo, socials, education, workExperience, projects, skills, achievements, certifications, leadership, extracurriculars,summary, name, sections, customSections, customSectionData, margins]);



    const handleNext = () => {
        setCurrentSection(prevSection => Math.min(prevSection + 1, sections.length - 1));
    };

    const handlePrevious = () => {
        setCurrentSection(prevSection => Math.max(prevSection - 1, 0));
    };

    const handleSubmission = () => {
        const data = {
            personalInfo, socials, education, certifications,workExperience, projects, skills, name, sections, id, customSections, customSectionData
        };

        localStorage.setItem('current_resume_data', JSON.stringify(data));

        setfullView(true);
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            const data = {
                personalInfo, socials, education, workExperience, projects, skills, name, sections, id, customSections, customSectionData, keywords, jobDescription, margins
            };
            localStorage.setItem('current_resume_data', JSON.stringify(data));
            console.log('Auto-saved resume data');
        }, 5000); // 10 seconds

        console.log('Auto-save interval started');


        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [personalInfo, socials, education, workExperience, projects, skills, name, sections, id, customSections, customSectionData, keywords, jobDescription, summary, achievements, certifications, leadership, extracurriculars]);



    const handleBack = () => {
        const currentData = localStorage.getItem('current_resume_data');
        if (currentData) {
            localStorage.removeItem('current_resume_data');
        }
        else {
            console.log('No data to remove');
        }
        navigate('/home');
    }


    //show alert dialog
    const checkIfSaved = () => {
        if (saved) {
            localStorage.removeItem('current_resume_data');
            navigate('/home');
            
        }
        else {
            //check if any content has been added
            const isContentAdded = () => {
                return (
                    personalInfo.first_name !== '' ||
                    personalInfo.last_name !== '' ||
                    personalInfo.email !== '' ||
                    personalInfo.phone !== '' ||
                    personalInfo.location !== '' ||
                    socials.some(social => social.platform !== '' || social.url !== '') ||
                    education.some(edu => edu.college !== '' || edu.degree !== '' || edu.startDate !== '' || edu.endDate !== '' || edu.courses.length > 0 || edu.gpa !== '' || edu.major !== '' || edu.minor !== '' || edu.location !== '') ||
                    workExperience.some(work => work.jobTitle !== '' || work.company !== '' || work.startDate !== '' || work.endDate !== '' || work.description !== '' || work.location !== '') ||
                    projects.some(project => project.title !== '' || project.description !== '' || project.link !== '') ||
                    skills.length > 0 ||
                    achievements.some(achievement => achievement.title !== '' || achievement.description !== '' || achievement.date !== '') ||
                    certifications.some(certification => certification.name !== '' || certification.issuer !== '' || certification.dateObtained !== '' || certification.expirationDate !== '' || certification.credentialID !== '' || certification.credentialURL !== '' || certification.description !== '')   ||
                    leadership.some(leader => leader.position !== '' || leader.organization !== '' || leader.startDate !== '' || leader.endDate !== '' || leader.description !== '') ||
                    extracurriculars.some(extra => extra !== ''),
                    name !== '' || summary !== ''
                    

                );
            };


            if (isContentAdded()) {
                setShowConfirmDialog(true);

            }
            else {
                navigate('/home');
            }
        }
    }

    const saveData = () => {


        if (name === '' || name === null) {
            setShowNameWarning(true);
            return;
        }



        const data = {
            personalInfo, socials, education, workExperience, projects, skills,  name, sections, id, keywords, jobDescription, summary, customSections, customSectionData, margins
        };

        


        //saved to the database
        postResume(data);

        
    }

    const handleReorderSections = (newSections) => {
        if (newSections.length < sections.length) {
            // A section was deleted
            setCurrentSection(0);
        } else {
            // Sections were reordered
            const currentSectionName = sections[currentSection].name;
            const newCurrentSectionIndex = newSections.findIndex(section => section.name === currentSectionName);
             setCurrentSection(newCurrentSectionIndex);
        }
        setSections(newSections);
        console.log('Updated sections:', newSections);
        // Update the customSections
        //go throught the sections and check if the object is a custom section, if it is update the custom section id   
        const updatedCustomSections = customSections.map(customSection => {
            const newSection = newSections.find(section => section.name === customSection.name);
            return newSection ? { ...customSection, id: newSection.id } : customSection;
        }
        );
        setCustomSections(updatedCustomSections);
        console.log('Updated custom sections:', updatedCustomSections);

    };

    const handleChangeCustomSectionName = (customSection_id, newName, sectionData) => {
        setSections(prevSections => 
            prevSections.map(section => 
                section.section_id === customSection_id ? { ...section, name: newName } : section
            )
        );

        setCustomSections(prevCustomSections => 
            prevCustomSections.map(section => 
                section.section_id === customSection_id ? { ...section, name: newName } : section
            )
        );

        // Update the customSectionData
        setCustomSectionData(prevData => {
            const oldName = customSections.find(section => section.section_id === customSection_id)?.name;
            if (oldName && oldName !== newName) {
                const { [oldName]: oldData, ...rest } = prevData;
                return {
                    ...rest,
                    [newName]: sectionData
                };
            }
            return prevData;
        });
    };

    const handleDeleteCustomSection = (section_id) => {


       //remove the section from the custom sections 

       const updatedCustomSections = customSections.filter(section => section.id !== section_id);
         setCustomSections(updatedCustomSections);


        setCustomSectionData(prevData => {
            const sectionName = customSections.find(section => section.id === section_id)?.name;
            if (sectionName) {
                const { [sectionName]: _, ...rest } = prevData;
                return rest;
            }
            return prevData;
        });

        const updatedSections = sections.filter(section => section.id !== section_id);
        // Update the id of each section
        updatedSections.forEach((section, index) => {
            section.id = index;
        }

        );
        setSections(updatedSections);

        

    }

    const toggleSingleLineLayout = (section_id, isSingleLine) => {

        console.log('Toggling single line layout:', section_id, isSingleLine);
        setSections(prevSections => 
            prevSections.map(section => 
                section.id === section_id ? { ...section, singleLine: isSingleLine } : section
            )
        );
        setCustomSections(prevCustomSections =>
            prevCustomSections.map(section =>
                section.id === section_id ? { ...section, singleLine: isSingleLine } : section
            )
        );

        console.log('Updated sections:', sections);
    }




    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white p-4 flex items-center space-x-4 rounded border-b" style={{ height: '10vh' }}>
                <div className="bg-white rounded-full p-2">
                    <span className="text-2xl cursor-pointer" onClick={checkIfSaved}>🔙</span> {/* Back icon */}
                </div>
                <div className="flex-grow flex items-center bg-white rounded p-2 max-w-md">
                    <span className="text-2xl mr-2">{emojis[progressInfo.sectionsfilled]}</span>
                    <div className="w-full bg-gray-300 rounded-full h-2.5">
                        <div
                            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                            style={{ width: `${progressInfo.progressPercentage}%` }}
                        ></div>
                    </div>
                    <span className="ml-2 font-bold">{`${progressInfo.progressPercentage}%`}</span>
                </div>
                <button
                    onClick={() => {
                        saveData();
                    }}
                    className={`px-4 py-2 rounded text-white ${saved ? 'bg-green-500' : 'bg-yellow-500 hover:bg-yellow-600'}`}
                >
                    {isLoading ? <div className="spinner">Loading...</div> : saved ? 'Saved ✅' : 'Save'}
                </button>

                <div className="flex items-center space-x-2 ml-4">
                    <span className="text-sm font-bold">Resume Name</span>
                    <input
                        type="text"
                        className={`border rounded p-1 ${showNameWarning && name === '' ? 'border-red-500' : 'border-gray-300'}`}
                        autoComplete="off" // Disable autocomplete
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {showNameWarning && name === '' && <span className="text-red-500 text-sm">Name is required</span>}
                </div>

                    {keywords && keywords.length > 0 && (
                        <button
                            onClick={openDialog}
                            className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            View Keywords
                        </button>
                    )}

                    {jobDescription &&  (
                        <button
                            onClick={() => alert(`Job Description: ${jobDescription}`)}
                            className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            View Job Description
                        </button>
                    )}





            </header>
            {keywords && keywords.length > 0 && (
                <KeywordsDialog
                isOpen={isDialogOpen}
                onClose={closeDialog}
                keywords={keywords}
                resumeKeywords={keywords}
            />
            )
            }

            

            {/* Main content */}
            <div className="flex-grow flex flex-col items-start md:flex-row p-4 space-y-4 md:space-y-0 md:space-x-4 overflow-hidden">
                {/* Sidebar */}
                <nav className="h-96"
                
                style={
                    {
                        width: `15%`,
                    }
                }

                >
                    <Section
                        sections={sections}
                        currentSection={currentSection}
                        setCurrentSection={setCurrentSection}
                        setReorderedSections={handleReorderSections}
                        deleteCustomSection={(section_id) => handleDeleteCustomSection(section_id)}
                        handleAddCustomSection={(sectionName) => addCustomSection(sectionName)}
                    />
                </nav>
                {/* Form content */}
                <main className="flex flex-col justify-between items-center md:w-2/4 bg-white rounded-lg shadow-md p-1" style={{ height: '80vh',

                width: `${middleWidth}px`,
                resize: 'horizontal',
                overflow: 'auto'
                
                 }}>

                    {!sections[currentSection ]? ( <> {setCurrentSection(sections.length-1)} </>)
                    :(<Card title={`${sections[currentSection].emoji} ${sections[currentSection].name}`}>
                        {sections[currentSection].name === 'Personal Info' && <PersonalInfo personal_info={personalInfo} onChange={setPersonalInfo} />}
                        {sections[currentSection].name === 'Socials' && <Socials social_info={socials} onChange={setSocials} />}
                        {sections[currentSection].name === 'Education' && <Education education={education} setEducation={setEducation} />}
                        {sections[currentSection].name === 'Work Exp.' && <WorkExperience workExperience={workExperience} onChange={setWorkExperience} />}
                        {sections[currentSection].name === 'Projects' && <Projects projects_data={projects} onChange={setProjects} />}
                        {sections[currentSection].name === 'Skills' && <MultiFieldSkillsForm skill_sets={skills} onChange={setSkills} />}
                        {/* {sections[currentSection].name === 'Achievements' && <AchievementsForm achievements_parent={achievements} onChange={setAchievements} />}
                        {sections[currentSection].name === 'Certifications' && <Certifications  certifications_parent={certifications} onChange={setCertifications}/>}
                        {sections[currentSection].name === 'Extracurriculars' && <Extracurriculars activities_parent={extracurriculars} onChange={setExtracurriculars} />}
                        {sections[currentSection].name === 'Leadership' && <Leadership  leadership_parent ={leadership} onChange={setLeadership} />}
                        {sections[currentSection].name === 'Summary' && <SummaryForm summary_parent={summary} onChange={setSummary} />} */}
                        {customSections.map((section) => (
                            sections[currentSection].name === section.name && (
                                <CustomSectionForm
                                    key={section.id}
                                    sectionKey={section.id}
                                    uniqueId={section.section_id}
                                    sectionName={section.name}
                                    data={customSectionData[section.name] || []}
                                    onChange={(data) => handleCustomSectionChange(section.name, data)}
                                    onChangeSectionName={handleChangeCustomSectionName}
                                    handleIsSingleLine={(section_id, isSingleLine) => toggleSingleLineLayout(section_id, isSingleLine)}                                   
                                />
                            )
                        ))}

                    </Card>)}

                    <div className="flex justify-between space-x-8">
                        <button
                            onClick={handlePrevious}
                            disabled={currentSection === 0}
                            className={`px-4 rounded ${currentSection === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                        >
                            Previous
                        </button>
                        <button
                            onClick={currentSection === sections.length - 1 ? handleSubmission : handleNext}
                            className={`px-4 py-2 rounded ${currentSection === sections.length - 1 ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                        >
                            {currentSection === sections.length - 1 ? 'View' : 'Next'}
                        </button>
                    </div>
                </main>

               {/* Real-time preview */}
                <ResumePreview setfullView = {setfullView} personalInfo={personalInfo} socials={socials} education={education} workExperience={workExperience} projects={projects} skills={skills} name={name} sections={sections} keywords={keywords} customSections={customSections} customSectionData={customSectionData} margins={margins}
                setMargins={setMargins}

                />

                
            </div>

            {showConfirmDialog && (
                <ConfirmDialog
                    showConfirmDialog={showConfirmDialog}
                    setShowConfirmDialog={setShowConfirmDialog}
                    handleBack={handleBack}
                />
               
            )}
            {fullView && (
                <div className="fixed inset-0 bg-white z-50 overflow-auto">
                    
                    
                    <Resume 
                    previewMode={false}
                       previewData={
                        {
                            personalInfo,
                            socials,
                            education,
                            workExperience,
                            projects,
                            skills,
                            name,
                            sections,
                            keywords,
                            customSectionData,
                            customSections,
                            margins,
                            setMargins
                            
                        }
                       }
                       
                    />

                    <button
                        className="fixed top-4 right-10 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        onClick={() => setfullView(false)}
                    >
                        Close
                    </button>
                    <button
                        className="fixed top-4 left-10 bg-gray-200 hover:bg-gray-400 text-black px-4 py-2 rounded"
                        onClick={() => setfullView(false)}
                    >
                        🔙
                    </button>
                    
                </div>
            )
            }



        </div>
    );
};


const ConfirmDialog = ({ showConfirmDialog, setShowConfirmDialog, handleBack }) => (
    <AlertDialog.Root open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialog.Overlay className="fixed inset-0 bg-black opacity-50 z-20" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg z-20">
            <AlertDialog.Title className="text-lg font-bold">Confirm Action</AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm">
                Are you sure you want to proceed without saving your changes?
            </AlertDialog.Description>
            <div className="mt-4 flex justify-end space-x-2">
                <AlertDialog.Cancel asChild>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-gray-400 rounded text-white">No</button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                    <button className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded" onClick={handleBack}>Yes</button>
                </AlertDialog.Action>
            </div>
        </AlertDialog.Content>
    </AlertDialog.Root>
);


export default AddInfoPage;