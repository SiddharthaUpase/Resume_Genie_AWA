import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import PersonalInfo from './Cards/PersonalInfo';
import WorkExperience from './Cards/WorkExperience';
import Projects from './Cards/Projects';
import Socials from './Cards/Socials';
import Education from './Cards/Education';
import MultiFieldSkillsForm from './Cards/Skills';
import AchievementsForm from './Cards/Achievements';
import Resume from './ResumeReview';
import { useLocation } from 'react-router-dom';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import resume from '../resume_data.json'
import { useRef } from 'react';
import {closestCorners, DndContext} from '@dnd-kit/core';
import { useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Section from './SideBar Sections/Section';
import ResumePreview from './ResumePreviewWrapper';
import { storeResume } from '../Models/addInfoModels';
import { data } from 'autoprefixer';






const AddInfoPage = ({ }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const [currentSection, setCurrentSection] = useState(0);
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
    const emojis = ['😕', '🤨', '😐', ' 🙂', ' 😃', ' 😎', '🤩'];
    const [leftWidth, setLeftWidth] = useState(300);
    const [middleWidth, setMiddleWidth] = useState(1000);
    
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [saved, setSaved] = useState(false);
    const [name, setName] = useState('');
    const [fullView, setfullView] = useState(false);
    const [sections, setSections] = useState([
    { id: 0, name: 'Personal Info', emoji: '🧞' },
    { id: 1, name: 'Socials', emoji: '🧑‍💻' },
    { id: 2, name: 'Education', emoji: '🎓' },
    { id: 3, name: 'Work Exp.', emoji: '👔' },
    { id: 4, name: 'Projects', emoji: '🚀' },
    { id: 5, name: 'Skills', emoji: '🔧' },
    { id: 6, name: 'Achievements', emoji: '🏆' }]);
    const currentSectionData = sections[currentSection];
    const currentEmoji = currentSectionData ? currentSectionData.emoji : '';

        
   //the state to keep track of filled status of the required section
    const [filledStatus, setFilledStatus] = useState({
        personalInfo: false,
        socials: false,
        education: false,
        workExperience: false,
        projects: false,
        skills: false
    });

    useEffect(() => {
        const isPersonalInfoFilled = personalInfo.first_name !== '' ||
            personalInfo.last_name !== '' ||
            personalInfo.email !== '' ||
            personalInfo.phone !== '' ||
            personalInfo.location !== '';

        setFilledStatus(prevStatus => ({
            ...prevStatus,
            personalInfo: isPersonalInfoFilled
        }));
    }, [personalInfo]);

    useEffect(() => {
        const isSocialsFilled = socials.some(social =>  social.url !== '');

        setFilledStatus(prevStatus => ({
            ...prevStatus,
            socials: isSocialsFilled
        }));
    }, [socials]);

    useEffect(() => {
        const isEducationFilled = education.some(edu => edu.college !== '' || edu.degree !== '' || edu.startDate !== '' || edu.endDate !== '' || edu.courses.length > 0 || edu.gpa !== '' || edu.major !== '' || edu.minor !== '' || edu.location !== '');

        setFilledStatus(prevStatus => ({
            ...prevStatus,
            education: isEducationFilled
        }));
    }, [education]);

    useEffect(() => {
        const isWorkExperienceFilled = workExperience.some(work => work.jobTitle !== '' || work.company !== '' || work.startDate !== '' || work.endDate !== '' || work.description !== '' || work.location !== '');

        setFilledStatus(prevStatus => ({
            ...prevStatus,
            workExperience: isWorkExperienceFilled
        }));
    }, [workExperience]);

    useEffect(() => {
        const isProjectsFilled = projects.some(project => project.title !== '' || project.description !== '' || project.link !== '');

        setFilledStatus(prevStatus => ({
            ...prevStatus,
            projects: isProjectsFilled
        }));
    }, [projects]);

    useEffect(() => {
        const isSkillsFilled = skills.length > 0;

        setFilledStatus(prevStatus => ({
            ...prevStatus,
            skills: isSkillsFilled
        }));
    }, [skills]);

    useEffect(() => {
        console.log('Full View:',fullView);

    }, [fullView]);

    useEffect(() => {   
        console.log('Resume ID:',id);
    }, [id]);

    
//debug useeffect to check the data
    useEffect(() => {
        console.log('filledStatus:', filledStatus);
    }, [filledStatus]);


    
    

    //create an endpoin to post the resume data
    const postResume = async (data) => {
        const storedSession = JSON.parse(localStorage.getItem("session"));

        const newResume = {
            user_id: storedSession.user_id,
            resume_data: data,
            status: 'draft',
            name: name
        };
        console.log('ResumeID',newResume.resume_data.id);
        //user_id, 
        console.log('User ID:', storedSession.user_id);
        
        try {
            const response = await storeResume(newResume,set_id);
            


        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        const currentData = localStorage.getItem('current_resume_data');


        if (currentData) {
            const data = JSON.parse(currentData);
            setPersonalInfo(data.personalInfo);
            setSocials(Array.isArray(data.socials) ? data.socials : [
                { platform: 'linkedin', url: '' },
                { platform: 'github', url: '' },
                { platform: 'portfolio', url: '' }
            ]);
            setEducation(data.education);
            setWorkExperience(data.workExperience);
            setProjects(data.projects);
            setSkills(data.skills);
            setAchievements(data.achievements);
            setName(data.name);
            setSections(data.sections);
            set_id(data.id);
        } else if (location.state && location.state.data) {
            console.log('Location state:', location.state.data);
            const data = location.state.data;
            setPersonalInfo(data.personalInfo);
            setSocials(Array.isArray(data.socials) ? data.socials : [
                { platform: 'linkedin', url: '' },
                { platform: 'github', url: '' },
                { platform: 'portfolio', url: '' }
            ]);
            setEducation(data.education);
            setWorkExperience(data.workExperience);
            setProjects(data.projects);
            setSkills(data.skills);
            setAchievements(data.achievements);
            
            if(data.id === ''){
                set_id('');
            }
            else{
                set_id(data.id);
            }
            
            if (data.sections) {
                setSections(data.sections);
            }
            else {
                setSections([
                    { id: 0, name: 'Personal Info', emoji: '🧞' },
                    { id: 1, name: 'Socials', emoji: '🧑‍💻' },
                    { id: 2, name: 'Education', emoji: '🎓' },
                    { id: 3, name: 'Work Exp.', emoji: '👔' },
                    { id: 4, name: 'Projects', emoji: '🚀' },
                    { id: 5, name: 'Skills', emoji: '🔧' },
                    { id: 6, name: 'Achievements', emoji: '🏆' }
                ]);
            }
            

            //check if the name key exists in the data object
            if (data.name) {
                setName(data.name);
            }
            else {
                //add the name key to the data object
                data.name = '';
                setName('');
            }
        } else {
            setPersonalInfo({ first_name: '', last_name: '', email: '', phone: '', location: '' });
            setSocials([
                { platform: 'linkedin', url: '' },
                { platform: 'github', url: '' },
                { platform: 'portfolio', url: '' }
            ]);
            setEducation([{ college: '', degree: '', startDate: '', endDate: '', courses: [], gpa: '', major: '', minor: '', location: '' }]);
            setWorkExperience([{ jobTitle: '', company: '', startDate: '', endDate: '', description: '', location: '' }]);
            setProjects([{ title: '', description: '', link: '' }]);
            setSkills([]);
            setAchievements([{ title: '', description: '', date: '' }]);
            setName('');
            setSections([

                { id: 0, name: 'Personal Info', emoji: '🧞' }, 
                { id: 1, name: 'Socials', emoji: '🧑‍💻' },
                { id: 2, name: 'Education', emoji: '🎓' },
                { id: 3, name: 'Work Exp.', emoji: '👔' },
                { id: 4, name: 'Projects', emoji: '🚀' },
                { id: 5, name: 'Skills', emoji: '🔧' },
                { id: 6, name: 'Achievements', emoji: '🏆' }
            ]);
            set_id('');
        }
    }, []);


    //create useeffect to savea copy at eny point and if any changes are made to the data turn the saved to false

    useEffect(() => {

        setSaved(false);
    }, [personalInfo, socials, education, workExperience, projects, skills, achievements, name]);



    const handleNext = () => {
        setCurrentSection(prevSection => Math.min(prevSection + 1, sections.length - 1));
    };

    const handlePrevious = () => {
        setCurrentSection(prevSection => Math.max(prevSection - 1, 0));
    };

    const handleSubmission = () => {
        const data = {
            personalInfo, socials, education, workExperience, projects, skills, achievements, name, sections, id
        };

        localStorage.setItem('current_resume_data', JSON.stringify(data));
        // localStorage.setItem('resume_data', JSON.stringify(data));
        navigate('/resume-review', { state: { data } });
    };
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
            navigate('/home');
            localStorage.removeItem('current_resume_data');
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
                    achievements.some(achievement => achievement.title !== '' || achievement.description !== '' || achievement.date !== '')
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
            alert('Please enter a name for the resume');
            return;
        }



        const data = {
            personalInfo, socials, education, workExperience, projects, skills, achievements, name, sections, id
        };

        console.log('Data:', data);


        //saved to the database
        postResume(data);

        setSaved(true);
    }

    const handleReorderSections = (newSections) => {
        const currentSectionName = sections[currentSection].name;
        setSections(newSections);
        const newCurrentSectionIndex = newSections.findIndex(section => section.name === currentSectionName);
        setCurrentSection(newCurrentSectionIndex);
    };



    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white p-4 flex items-center space-x-4 rounded border-b" style={{ height: '10vh' }}>
                <div className="bg-white rounded-full p-2">
                    <span className="text-2xl cursor-pointer" onClick={checkIfSaved}>🔙</span> {/* Back icon */}
                </div>
                <div className="flex-grow flex items-center bg-white rounded p-2 max-w-md">
                    <span className="text-2xl mr-2">{currentEmoji}</span>
                    <div className="w-full bg-gray-300 rounded-full h-2.5">
                        <div
                            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                            style={{ width: `${((currentSection + 1) / emojis.length) * 100}%` }}
                        ></div>
                    </div>
                    <span className="ml-2 font-bold">{`${Math.round(((currentSection + 1) / emojis.length) * 100)}%`}</span>
                </div>
                <button
                    onClick={() => {
                        saveData();
                    }}
                    className={`px-4 py-2 rounded text-white ${saved ? 'bg-green-500' : 'bg-yellow-500 hover:bg-yellow-600'}`}
                >
                    {saved ? 'Saved ✅' : 'Save'}
                </button>

                <div className="flex items-center space-x-2 ml-4">
                    <span className="text-sm font-bold">Resume Name</span>
                    <input
                        type="text"
                        className="border border-gray-300 rounded p-1"
                        autoComplete="off" // Disable autocomplete
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
            </header>

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
                    />
                </nav>
                {/* Form content */}
                <main className="flex flex-col justify-between items-center md:w-2/4 bg-white rounded-lg shadow-md p-1" style={{ height: '80vh',

                width: `${middleWidth}px`,
                resize: 'horizontal',
                overflow: 'auto'
                
                 }}>
                    <Card title={`${sections[currentSection].emoji} ${sections[currentSection].name}`}>
                        {sections[currentSection].name === 'Personal Info' && <PersonalInfo personal_info={personalInfo} onChange={setPersonalInfo} />}
                        {sections[currentSection].name === 'Socials' && <Socials social_info={socials} onChange={setSocials} />}
                        {sections[currentSection].name === 'Education' && <Education education={education} setEducation={setEducation} />}
                        {sections[currentSection].name === 'Work Exp.' && <WorkExperience workExperience={workExperience} onChange={setWorkExperience} />}
                        {sections[currentSection].name === 'Projects' && <Projects projects_data={projects} onChange={setProjects} />}
                        {sections[currentSection].name === 'Skills' && <MultiFieldSkillsForm skill_sets={skills} onChange={setSkills} />}
                        {sections[currentSection].name === 'Achievements' && <AchievementsForm achievements_parent={achievements} onChange={setAchievements} />}
                    </Card>

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
                            {currentSection === sections.length - 1 ? 'Submit' : 'Next'}
                        </button>
                    </div>
                </main>

               {/* Real-time preview */}
                <ResumePreview setfullView = {setfullView} personalInfo={personalInfo} socials={socials} education={education} workExperience={workExperience} projects={projects} skills={skills} achievements={achievements} name={name} sections={sections} />

                
            </div>

            {showConfirmDialog && (
                <AlertDialog.Root open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                    <AlertDialog.Overlay className="fixed inset-0 bg-black opacity-50" />
                    <AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg">
                        <AlertDialog.Title className="text-lg font-bold">Confirm Action</AlertDialog.Title>
                        <AlertDialog.Description className="mt-2 text-sm">
                            Are you sure you want to proceed with this action?
                        </AlertDialog.Description>
                        <div className="mt-4 flex justify-end space-x-2">
                            <AlertDialog.Cancel asChild>
                                <button className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded">Cancel</button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action asChild>
                                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded" onClick={handleBack}>Confirm</button>
                            </AlertDialog.Action>
                        </div>
                    </AlertDialog.Content>
                </AlertDialog.Root>
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
                            achievements,
                            name,
                            sections
                        }
                       }
                    />
                    <button 
                        className="fixed top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded" 
                        onClick={() => setfullView(false)}
                    >
                        Close
                    </button>
                </div>
            )
            }


        </div>
    );
};

export default AddInfoPage;