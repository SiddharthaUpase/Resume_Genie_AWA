import React, { useState, useEffect } from 'react';

const EducationForm = ({ education, setEducation }) => {
  const [educations, setEducations] = useState(education.length > 0 ? education : [
    { college: '', degree: '', startDate: '', endDate: '', courses: [], gpa: '', major: '', minor: '' }
  ]);
  const [currentCourse, setCurrentCourse] = useState('');

  useEffect(() => {
    setEducation(educations);
  }, [educations, setEducation]);

  const handleAddEducation = () => {
    if (educations.length < 3) {
      setEducations([...educations, { college: '', degree: '', startDate: '', endDate: '', courses: [], gpa: '', major: '', minor: '', location: '' }]);
    }
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newEducations = [...educations];
    newEducations[index][name] = value;
    setEducations(newEducations);
  };

  const handleCourseInputChange = (event) => {
    setCurrentCourse(event.target.value);
  };

  const handleCourseKeyDown = (index, event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addCourse(index);
    }
  };

  const addCourse = (index) => {
    const trimmedCourse = currentCourse.trim();
    if (trimmedCourse && !educations[index].courses.includes(trimmedCourse)) {
      const newEducations = [...educations];
      newEducations[index].courses.push(trimmedCourse);
      setEducations(newEducations);
      setCurrentCourse('');
    }
  };

  const handleRemoveCourse = (educationIndex, courseIndex) => {
    const newEducations = [...educations];
    newEducations[educationIndex].courses.splice(courseIndex, 1);
    setEducations(newEducations);
  };

  const handleDeleteEducation = (index) => {
    if (educations.length > 1) {
      const newEducations = educations.filter((_, i) => i !== index);
      setEducations(newEducations);
    }
  };

  return (
    <div className="flex flex-col items-start space-y-4 max-w-3xl mx-auto bg-white">
      {educations.map((edu, index) => (
        <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-lg relative w-full">
          {educations.length > 1 && (
            <button
              onClick={() => handleDeleteEducation(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 focus:outline-none"
              aria-label="Delete education entry"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* College input */}
            <div className="mb-4">
              <label htmlFor={`college-${index}`} className="block mb-2 text-sm font-medium text-gray-900">College</label>
              <input
                type="text"
                id={`college-${index}`}
                name="college"
                value={edu.college}
                onChange={(e) => handleInputChange(index, e)}
                className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor={`location-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Location</label>

              <input
                type="text"
                id={`location-${index}`}
                name="location"
                value={edu.location}
                onChange={(e) => handleInputChange(index, e)}
                className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            

            {/* Degree input */}
            <div className="mb-4">
              <label htmlFor={`degree-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Degree</label>
              <input
                type="text"
                id={`degree-${index}`}
                name="degree"
                value={edu.degree}
                onChange={(e) => handleInputChange(index, e)}
                className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* GPA input */}
            <div className="mb-4">
              <label htmlFor={`gpa-${index}`} className="block mb-2 text-sm font-medium text-gray-900">GPA</label>
              <input
                type="text"
                id={`gpa-${index}`}
                name="gpa"
                value={edu.gpa}
                onChange={(e) => handleInputChange(index, e)}
                className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
                placeholder='3.5'
              />
            </div>

            {/* Major input */}
            <div className="mb-4">
              <label htmlFor={`major-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Major</label>
              <input
                type="text"
                id={`major-${index}`}
                name="major"
                value={edu.major}
                onChange={(e) => handleInputChange(index, e)}
                placeholder='Computer Science'
                className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Minor input */}
            <div className="mb-4">
              <label htmlFor={`minor-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Minor</label>
              <input
                type="text"
                id={`minor-${index}`}
                name="minor"
                value={edu.minor}
                onChange={(e) => handleInputChange(index, e)}
                placeholder='Mathematics'
                className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Start Date input */}
            <div className="mb-4">
              <label htmlFor={`startDate-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Start Date</label>
              <input
                type="date"
                id={`startDate-${index}`}
                name="startDate"
                value={edu.startDate}
                onChange={(e) => handleInputChange(index, e)}
                className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor={`endDate-${index}`} className="block mb-2 text-sm font-medium text-gray-900">End Date</label>
              <input
                type="date"
                id={`endDate-${index}`}
                name="endDate"
                value={edu.endDate}
                onChange={(e) => handleInputChange(index, e)}
                className={`block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 ${edu.endDate === 'Present' ? 'bg-gray-200' : ''}`}
                disabled={edu.endDate === 'Present'}
              />
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id={`present-${index}`}
                  name="present"
                  checked={edu.endDate === 'Present'}
                  onChange={(e) => {
                    const newEducations = [...educations];
                    newEducations[index].endDate = e.target.checked ? 'Present' : '';
                    setEducations(newEducations);
                  }}
                  className="mr-2"
                />
                <label htmlFor={`present-${index}`} className="text-sm font-medium text-gray-900">Present</label>
              </div>
            </div>
          </div>
          

          {/* Courses input */}
          <div className="mb-4">
            <label htmlFor={`courses-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Important Courses (Press Enter or comma to add)</label>
            <input
              type="text"
              id={`courses-${index}`}
              value={currentCourse}
              onChange={handleCourseInputChange}
              onKeyDown={(e) => handleCourseKeyDown(index, e)}
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Display courses as chips */}
          <div className="mt-2 flex flex-wrap">
            {edu.courses.map((course, courseIndex) => (
              <div key={courseIndex} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full mr-2 mb-2 flex items-center">
                {course}
                <button
                  type="button"
                  onClick={() => handleRemoveCourse(index, courseIndex)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Add education button */}
      {educations.length < 3 && (
        <button
          onClick={handleAddEducation}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Add Another Education (Max 3)
        </button>
      )}
    </div>
  );
};

export default EducationForm;