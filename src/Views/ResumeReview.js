import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { Download } from 'lucide-react';
import { s, summary } from 'framer-motion/client';
import DOMPurify from 'dompurify';
import { render } from '@testing-library/react';




const Resume = ({ previewMode = false, previewData = null }) => {

    //get data from local storage
    const resumeRef = useRef();
    const [isOverflowing, setIsOverflowing] = useState(false);
    const location = useLocation();

   

    //check if previewData has key words
    const data = previewData || location.state.data;

    const { personalInfo, socials, education, workExperience, projects, skills, achievements, certifications, leadership, extracurriculars,summary, sections, keywords,customSections,
        customSectionData } = data;


        const renderHTML = (html, keywords, isSingleLine) => {
            const allowedTags = isSingleLine 
                ? ['b', 'i', 'em', 'strong', 'a', 'u'] 
                : ['b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'u', 'p'];

            const sanitizedHTML = DOMPurify.sanitize(html, { 
                ALLOWED_TAGS: allowedTags,
                ALLOWED_ATTR: ['href', 'target', 'rel']
            });
            
            if (isSingleLine) {
                // For single line, remove all HTML tags except for inline formatting
                // This regex now properly handles both opening and closing tags
                const strippedHTML = sanitizedHTML.replace(/<(?!\/?(?:b|i|em|strong|a|u)\b)[^>]+>/gi, '');
                return <span dangerouslySetInnerHTML={{ __html: strippedHTML }} />;
            } else {
                return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
            }

            

        };
    
  

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
    }, [personalInfo, socials, education, workExperience, projects, skills,  sections]);


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

    // Update the parseFormattedText function to use Tailwind classes
const parseFormattedText = (text) => {
    const patterns = [
      // Bold italic underline
      { regex: /\*\*_\*(.*?)\*_\*\*/g, style: 'font-bold italic underline' },
      // Bold italic
      { regex: /\*\*\*(.*?)\*\*\*/g, style: 'font-bold italic' },
      // Bold underline
      { regex: /\*\*_(.*?)_\*\*/g, style: 'font-bold underline' },
      // Italic underline
      { regex: /\*_(.*?)_\*/g, style: 'italic underline' },
      // Bold
      { regex: /\*\*(.*?)\*\*/g, style: 'font-bold' },
      // Italic
      { regex: /\*(.*?)\*/g, style: 'italic' },
      // Underline
      { regex: /__(.*?)__/g, style: 'underline' },
    ];
  
    let parts = [{ text, style: '' }];
  
    patterns.forEach(({ regex, style }) => {
      parts = parts.flatMap(part => {
        if (!part.style) {
          const splits = part.text.split(regex);
          return splits.map((text, i) => {
            if (i % 2 === 0) return { text, style: '' };
            // Convert style string to Tailwind classes
            const tailwindClasses = style.split(' ').map(s => {
              switch (s) {
                case 'font-bold': return 'font-bold';
                case 'italic': return 'italic';
                case 'underline': return 'underline';
                default: return '';
              }
            }).filter(Boolean).join(' ');
            return { text, style: tailwindClasses };
          });
        }
        return [part];
      });
    });
  
    return parts.map((part, index) => (
      <span key={index} className={part.style}>
        {part.text}
      </span>
    ));
  };

    const DateComponent = ({ startMonth, endMonth }) => {
        return (
            <span style={dateStyle}>
                {formatDate(startMonth)} - {formatDate(endMonth)}
            </span>
        );
    };

// Update the highlightText function to handle both keywords and Tailwind formatting
const highlightText = (text, keywords) => {
    if (!keywords || keywords.length === 0) return parseFormattedText(text);
    if (!previewMode) return parseFormattedText(text);
  
    const pattern = new RegExp(`(${keywords.join('|')})`, 'gi');
    const parts = text.split(pattern);
  
    return parts.map((part, index) => {
      const isKeyword = keywords.some(keyword =>
        part.toLowerCase() === keyword.toLowerCase()
      );
  
      if (isKeyword) {
        return (
          <span key={index} className="bg-yellow-200 px-0.5 rounded">
            {part}
          </span>
        );
      }
  
      return parseFormattedText(part);
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
                    
                    <div className='work-experience' style={descriptionStyle}>
                     {renderHTML(exp.description, keywords, false)}
                     </div>

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
                    <div className='work-experience' style={descriptionStyle}>
                     {renderHTML(project.description, keywords, false)}
                     </div>
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

    const renderSummary = (summary, keywords) => (
        <section className="mb-1">
            <h2 className="font-bold border-b border-black mb-1" style={{ fontSize: '14px' }}>SUMMARY</h2>
            <p style={{ fontSize: '12px' }}>
                {renderHTML(summary, keywords, false)}
            </p>
        </section>
    );
  

    const renderExtracurriculars = (extracurriculars, keywords) => (
        <section className="mb-1">
            <h2 className="font-bold border-b border-black mb-1" style={{ fontSize: '14px' }}>EXTRACURRICULAR ACTIVITIES</h2>
            {extracurriculars.map((activity, index) => (
                <div key={index} className="mb-1">
                    <div className="flex justify-between items-baseline">
                        <strong style={{ fontSize: '12.5px' }}>{activity.name}</strong>
                        <span style= {dateStyle}>
                            {formatDate(activity.startMonth)} - {activity.endMonth ? formatDate(activity.endMonth) : 'Present'}
                        </span>
                    </div>
                    <div style={{ fontSize: '12px' }}>
                        <span>{activity.organization}</span>
                    </div>
                    {activity.description && (
                        <p style={{ fontSize: '12px', marginTop: '2px' }}>
                            {highlightText(activity.description, keywords)}
                        </p>
                    )}
                </div>
            ))}
        </section>
    );

    const renderCustomSection = (sectionName, sectionData, keywords, isSingle) => (
        <section className="mb-1">
            <h2 className="font-bold border-b border-black mb-1" style={{ fontSize: '14px' }}>
                {sectionName.toUpperCase()}
            </h2>
            {sectionData.map((item, index) => (
                <div key={index} className="mb-1">
                    {isSingle ? (
                        <div style={{ fontSize: '12.5px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>
                            <strong style={subHeaderStyle}>{item.title}</strong>
                                {item.startMonth && item.endMonth && (
                                    <span> ({item.startMonth} - {item.endMonth}):</span>
                                )}
                                <span style={{ marginLeft: '4px' }}>
                                    {renderHTML(item.description, keywords, true)}
                                </span>
                            </span>
                        </div>
                    ) : (
                        <div style={{ fontSize: '12.5px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                               <strong style={subHeaderStyle}>{item.title}</strong>
                                {item.startMonth && item.endMonth && (
                                    <DateComponent startMonth={item.startMonth} endMonth={item.endMonth} />
                                )}
                            </div>
                            <div className="custom-section-content">
                                {renderHTML(item.description, keywords, false)}
                            </div>
                            {item.additionalInfo && <p>{highlightText(item.additionalInfo, keywords)}</p>}
                        </div>
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
                                    <div className="flex space-x-1 items-center">
                                        <strong style={subHeaderStyle}>{edu.college}</strong>
                                        {edu.location && <p style={{ fontSize: '12px' }}>({edu.location})</p>}
                                    </div>
                                    <DateComponent startMonth={edu.startDate} endMonth={edu.endDate} />
                                </div>

                                <div className="flex space-x-1 items-center">
                                {(edu.degree && edu.major) && (
                                    <p style={{ fontSize: '12px' }}>
                                        {edu.degree && edu.major ? `${edu.degree} in ${edu.major}` : edu.degree || edu.major}
                                        <span className="border-l border-black h-3 mx-1"></span>
                                    </p>
                                )}
                                    {edu.minor && (
                                        <>
                                            <p style={{ fontSize: '12px' }}>{edu.minor}</p>
                                            <span className="border-l border-black h-3 mx-1"></span>
                                        </>
                                    )}
                                    {edu.gpa && <p style={{ fontSize: '12px' }}>GPA: {edu.gpa}</p>}
                                </div>
                                {edu.courses && edu.courses.length > 0 && (
                                    <p style={{ fontSize: '12px' }}>
                                        <strong>Coursework:</strong> {edu.courses.join(', ')}
                                    </p>
                                )}
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
            // case 'Achievements':
            //     return achievements.length > 0 && renderAchievements(achievements, keywords);
            // case 'Certifications':
            //     return certifications.length > 0 && renderCertifications(certifications, keywords);
            // case 'Leadership':
            //     return leadership.length >0 && renderLeadership(leadership, keywords);
            // case 'Summary':
            //     return summary && renderSummary(summary, keywords);

            // case 'Extracurriculars':
            //     return extracurriculars.length > 0 && renderExtracurriculars(extracurriculars, keywords);

                default:
                    // Check if it's a custom section
                   //render custom section
                    const customSection = customSections.find(section => section.name === sectionType);
                    
                    if (customSection) {

                        const sectionData = customSectionData[sectionType];
                        return sectionData.length > 0 && renderCustomSection(sectionType, sectionData, keywords, customSection.singleLine);
                    }

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
                    <style jsx>{`
        .custom-section-content ul, .work-experience ul {
            list-style-type: disc;
            padding-left: 20px;
            margin-top: 5px;
            margin-bottom: 5px;
        }
        .custom-section-content ol, .work-experience ol {
            list-style-type: decimal;
            padding-left: 20px;
            margin-top: 5px;
            margin-bottom: 5px;
        }
        .custom-section-content li, .work-experience li {
            margin-bottom: 2px;
        }
    a {
        color: #0000EE;
        text-decoration: underline;
    }
    a:hover {
        text-decoration: underline;
    }


    `}</style>



                </div>


            </div>
            {/* Download Button */}
            <PrintButton />
        </div>
    );
};

export default Resume;