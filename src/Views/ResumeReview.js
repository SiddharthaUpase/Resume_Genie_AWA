import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { Download } from 'lucide-react';



const Resume = ({ previewMode = false, previewData = null }) => {

    //get data from local storage
    const resumeRef = useRef();
    const [isOverflowing, setIsOverflowing] = useState(false);
    const location = useLocation();

    //check if previewData has key words
    const data = previewData || location.state.data;

    const { personalInfo, socials, education, workExperience, projects, skills, achievements, certifications, leadership, extracurriculars, sections, keywords } = data;

    // Flexible sections
    const flexibleSections = sections;

    useEffect(() => {
        const checkOverflow = () => {
            if (resumeRef.current) {
                const { scrollHeight, clientHeight } = resumeRef.current;
                setIsOverflowing(scrollHeight > clientHeight);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [personalInfo, socials, education, workExperience, projects, skills, achievements, certifications, leadership,extracurriculars, sections]);


    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Present';
        if (dateString === 'Present') return dateString;

        const date = new Date(dateString);
        date.setDate(1); // Set the day to the first day of the month
        date.setMonth(date.getMonth() + 1); // Increment the month by 1
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };


    // Function to handle PDF download
    const handlePrint = useReactToPrint({
        content: () => resumeRef.current,
        documentTitle: 'resume',
    });

    const timesNewRoman = '"Times New Roman", Times, serif';

    const dateStyle = {
        fontWeight: 'bold',
        fontSize: '12px'
    };

    const descriptionStyle = {
        fontSize: '12.5px'

    };

    const subHeaderStyle = {
        fontSize: '14px',
        fontWeight: 'bold'
    };

    const DateComponent = ({ startMonth, endMonth }) => {
        return (
            <span style={dateStyle}>
                {formatDate(startMonth)} - {formatDate(endMonth)}
            </span>
        );
    };

    const highlightText = (text, keywords) => {
        if (!keywords || keywords.length === 0) return text;
        if (!previewMode) return text;

        // Create a regex pattern from keywords
        const pattern = new RegExp(`(${keywords.join('|')})`, 'gi');

        // Split the text into parts that should be highlighted and those that shouldn't
        const parts = text.split(pattern);

        return parts.map((part, index) => {
            // Check if this part matches any keyword (case-insensitive)
            const isKeyword = keywords.some(keyword =>
                part.toLowerCase() === keyword.toLowerCase()
            );

            return isKeyword ? (
                <span
                    key={index}
                    className="bg-yellow-200 px-0.5 rounded"
                >
                    {part}
                </span>
            ) : part;
        });
    };

    const renderWorkExperience = (experience, keywords) => (
        <section className="mb-2">
            <h2 className="font-bold border-b border-black mb-1" style={{ fontSize: '14px' }}>
                WORK EXPERIENCE
            </h2>
            {experience.map((exp, index) => (
                <div key={index} className="mb">
                    <div className="flex justify-between">
                        <strong style={subHeaderStyle}>{exp.jobTitle}</strong>
                        <DateComponent startMonth={exp.startMonth} endMonth={exp.endMonth} />
                    </div>
                    <div className='flex space-x-1'>
                        <p style={{ fontSize: '13px' }}>{exp.company}</p>
                        {exp.location && <p style={{ fontSize: '13px' }}>({exp.location})</p>}
                    </div>
                    <ul className="list-disc pl-4" style={descriptionStyle}>

                        {Array.isArray(exp.description) ? (
                            exp.description.map((point, index) => (
                                <li key={index}>
                                    {highlightText(point, keywords)}
                                </li>
                            ))
                        ) : (
                            <li>
                                {highlightText(exp.description, keywords)}
                            </li>
                        )}
                    
                    </ul>
                </div>
            ))}
        </section>
    );

    // Similar implementation for Skills section:
    const renderSkills = (skills, keywords) => (
        <section className="mb-1">
            <h2 className="font-bold border-b border-black mb-1" style={{ fontSize: '14px' }}>
                SKILLS
            </h2>
            <ul className="list-disc pl-4" style={descriptionStyle}>
                {skills.map(([category, skillList], index) => (
                    <li key={index} className="mb">
                        <strong>{category}:</strong>{' '}
                        {highlightText(skillList.join(', '), keywords)}
                    </li>
                ))}
            </ul>
        </section>
    );

    // Example for Projects section:
    const renderProjects = (projects, keywords) => (
        <section className="mb-1">
            <h2 className="font-bold border-b border-black mb-1" style={{ fontSize: '14px' }}>
                PROJECTS
            </h2>
            {projects.map((project, index) => (
                <div key={index} className="mb-1">
                    <div className="flex flex-col">
                        <div className="flex justify-between">
                            <strong style={subHeaderStyle}>{project.title}</strong>
                            <DateComponent startMonth={project.startMonth} endMonth={project.endMonth} />
                        </div>
                        <a href={project.link} className="text-blue-600 hover:underline" style={{ fontSize: '13px' }}>
                            {project.link}
                        </a>
                    </div>
                    <ul className="list-disc pl-4" style={descriptionStyle}>
                        {Array.isArray(project.description) ? (
                            project.description.map((point, index) => (
                                <li key={index}>
                                    {highlightText(point, keywords)}
                                </li>
                            ))
                        ) : (
                            <li>
                                {highlightText(project.description, keywords)}
                            </li>
                        )}
                    </ul>
                </div>
            ))}
        </section>
    );

    const renderAchievements = (achievements, keywords) => (
        <section className="mb-1">
            <h2 className="font-bold border-b border-black mb-1" style={{ fontSize: '14px' }}>ACHIEVEMENTS</h2>
            {achievements.map((achievement, index) => (
                <div key={index} className="">
                    <p style={{ fontSize: '12px' }}>
                        <strong style={{ fontSize: '12.5px' }}>{achievement.title}</strong>
                        {achievement.date && <span className="ml-2" >({formatDate(achievement.date)}) </span>}
                        <span style={descriptionStyle}>  {highlightText(achievement.description, keywords)}</span>

                    </p>
                </div>
            ))}
        </section>

    )


const renderCertifications = (certifications, keywords) => (
  <section className="mb-1">
    <h2 className="font-bold border-b border-black mb-1" style={{ fontSize: '14px' }}>
      CERTIFICATIONS
    </h2>
    {certifications.map((certification, index) => (
      <div key={index} className="mb-1">
        <div className="flex flex-col">
          <div className="flex justify-between">
            <strong style={{ fontSize: '12.5px' }}>{certification.name}</strong>
            <span style={{ fontSize: '12px' }}>
              {formatDate(certification.dateObtained)}
              {certification.expirationDate && ` - ${formatDate(certification.expirationDate)}`}
            </span>
          </div>
          <div style={{ fontSize: '12px' }}>
            <span>{certification.issuer}</span>
            {certification.credentialID && (
              <span className="ml-2">ID: {certification.credentialID}</span>
            )}
          </div>
          {certification.credentialURL && (
            <a 
              href={certification.credentialURL} 
              className="text-blue-600 hover:underline" 
              style={{ fontSize: '11px' }}
              target="_blank" 
              rel="noopener noreferrer"
            >
              Verify Credential
            </a>
          )}
        </div>
        {certification.description && (
          <p style={{ fontSize: '12px', marginTop: '2px' }}>
            {highlightText(certification.description, keywords)}
          </p>
        )}
      </div>
    ))}
  </section>
);

const renderLeadership = (leadership, keywords) => (
    <section className="mb-1">
      <h2 className="font-bold border-b border-black mb-1" style={{ fontSize: '14px' }}>
        LEADERSHIP EXPERIENCE
      </h2>
      {leadership.map((experience, index) => (
        <div key={index} className="mb-1">
          <div className="flex justify-between items-baseline">
            <strong style={{ fontSize: '12.5px' }}>{experience.position}</strong>
            <span style={{ fontSize: '12px' }}>
              {formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : 'Present'}
            </span>
          </div>
          <div style={{ fontSize: '12px' }}>
            <span>{experience.organization}</span>
          </div>
          {experience.description && (
            <p style={{ fontSize: '12px', marginTop: '2px' }}>
              {highlightText(experience.description, keywords)}
            </p>
          )}
        </div>
      ))}
    </section>
  );


    // Function to render a section based on its type
    const renderSection = (sectionType) => {
        switch (sectionType) {
            case 'Education':
                return education.length > 0 && (
                    <section className="mb-1">
                        <h2 className="font-bold border-b border-black mb-1" style={{ fontSize: '14px' }}>EDUCATION</h2>
                        {education.map((edu, index) => (
                            <div key={index} className="mb-1">
                                <div className="flex justify-between">
                                    <div className="flex space-x-1">
                                        <strong style={subHeaderStyle}>{edu.college}</strong>
                                        {edu.location && <p style={{ fontSize: '12px' }}>({edu.location})</p>}
                                
                                    </div>
                                    <DateComponent startMonth={edu.startDate} endMonth={edu.endDate} />
                                </div>

                                <div className="flex space-x-1 items-center">
                                    {edu.degree && (
                                        <>
                                            <p style={{ fontSize: '12px' }}>{edu.degree}</p>
                                            <span className="border-l border-black h-3 mx-1"></span>
                                        </>
                                    )}
                                    {edu.major && (
                                        <>
                                            <p style={{ fontSize: '12px' }}>{edu.major}</p>
                                            <span className="border-l border-black h-3 mx-1"></span>
                                        </>
                                    )}
                                    {edu.minor && (
                                        <>
                                            <p style={{ fontSize: '12px' }}>{edu.minor}</p>
                                            <span className="border-l border-black h-3 mx-1"></span>
                                        </>
                                    )}
                                    {edu.gpa && <p style={{ fontSize: '12px' }}>GPA: {edu.gpa}</p>}
                                </div>
                                <p style={{ fontSize: '12px' }}> {edu.courses.join(', ')}</p>

                            </div>
                        ))}
                    </section>
                );
            case 'Work Exp.':
                return workExperience.length > 0 && renderWorkExperience(workExperience, keywords);
            case 'Projects':
                return projects.length > 0 && renderProjects(projects, keywords);
            case 'Skills':
                return skills.length > 0 && renderSkills(skills, keywords);
            case 'Achievements':
                return achievements.length > 0 && renderAchievements(achievements, keywords);
            case 'Certifications':
                return certifications.length > 0 && renderCertifications(certifications, keywords);
            case 'Leadership':
                return leadership.length >0 && renderLeadership(leadership, keywords);
            default:
                return null;
        }
    };



    const handleSave = () => {
        handlePrint();
    };

    // Only render the print button if not in preview mode
    const PrintButton = () => {
        if (previewMode) return null;

        return (
            <div className="text-center mt-4">
                <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none flex items-center justify-center space-x-2">
                    <Download size={16} />
                    <span>Download</span>
                </button>
            </div>
        );
    };

    useEffect(() => {
        const checkOverflow = () => {
            if (resumeRef.current) {
                const { scrollHeight, clientHeight } = resumeRef.current;
                setIsOverflowing(scrollHeight > clientHeight);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, []);

    const items = [
        { value: personalInfo.email, label: personalInfo.email },
        { value: personalInfo.phone, label: personalInfo.phone },
        { value: personalInfo.location, label: personalInfo.location },
        ...socials.map(social => ({
          value: social.url,
          label: social.platform,
          isLink: true,
          url: social.url
        }))
      ].filter(item => item.value);

    return (
        <div className='flex flex-col justify-start items-center' style={{ margin: 0, padding: 8 }}>
            <div className="w-full h-full relative">
                <div
                    className="w-[21.59cm] mx-auto bg-white pl-4 pr-4 pt-1.5 shadow-lg relative"
                    style={{
                        height: '27.94cm',
                        fontFamily: '"Times New Roman", Times, serif',
                        overflow: 'hidden',
                        border: '1px solid black',
                    }}
                    ref={resumeRef}
                >

                    {/* Header */}
                    <header>

                        <h1 className="font-bold text-center" style={{ fontSize: '16px' }}>{`${personalInfo.first_name.toUpperCase()} ${personalInfo.last_name.toUpperCase()}`}</h1>

                        <div className="flex justify-center items-center text-sm mt-1" style={{ fontSize: '13px' }}>
                            <div className="flex flex-wrap items-center">
                                {items.map((item, index) => (
                                    <React.Fragment key={index}>
                                        {index > 0 && <span className="border-l border-black h-3 mx-1"></span>}
                                        {item.isLink ? (
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => console.log(`Opening link: ${item.url}`)}
                                            >
                                                {item.label}
                                            </a>
                                        ) : (
                                            <span>{item.label}</span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </header>


                    {/* Flexible Sections */}
                    {flexibleSections.map((section, index) => (
                        <React.Fragment key={index}>
                            {renderSection(section.name)}
                        </React.Fragment>
                    ))}

                    {/* Overflow Warning */}
                    {isOverflowing && (
                        <div className="absolute top-0 left-0 right-0 bottom-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white p-4 rounded-lg shadow-lg">
                                <p className="text-red-500 font-bold text-lg">Warning: Content is overflowing.</p>
                                <p className="text-gray-700">Please adjust the content to fit within the page.</p>
                            </div>
                        </div>
                    )}



                </div>


            </div>
            {/* Download Button */}
            <PrintButton />
        </div>
    );
};

export default Resume;