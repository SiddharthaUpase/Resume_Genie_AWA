import React, { useEffect, useState } from 'react';

const MultiFieldSkillsForm = ({skill_sets = [], onChange}) => {
  const [skillSets, setSkillSets] = useState(() => {
    return skill_sets.length > 0
      ? skill_sets.map(([field, skills]) => ({ field, skills }))
      : [];
  });
  const [currentField, setCurrentField] = useState('');
  const [currentSkills, setCurrentSkills] = useState([]);
  const [newField, setNewField] = useState('');
  const [newSkills, setNewSkills] = useState({});

  useEffect(() => {
    const tupleData = skillSets.map(set => [set.field, set.skills]);
    onChange(tupleData);
  }, [skillSets, onChange]);

  const [fields, setFields] = useState([
    'Front-end Development',
    'Back-end Development',
    'Full-stack Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'Cloud Computing',
    'Cybersecurity',
  ]);

  const [skillsByField] = useState({
    'Front-end Development': ['HTML', 'CSS', 'JavaScript', 'React', 'Vue.js', 'Angular', 'TypeScript', 'Sass', 'Webpack'],
    'Back-end Development': ['Node.js', 'Python', 'Java', 'C#', 'Ruby', 'PHP', 'Go', 'SQL', 'NoSQL'],
    'Full-stack Development': ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Ruby', 'PHP', 'MEAN Stack', 'MERN Stack'],
    'Mobile Development': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Java (Android)', 'Xamarin', 'Ionic'],
    'Data Science': ['Python', 'R', 'SQL', 'Pandas', 'NumPy', 'SciPy', 'Matplotlib', 'Tableau', 'Power BI'],
    'Machine Learning': ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'NLTK', 'OpenCV'],
    'DevOps': ['Docker', 'Kubernetes', 'Jenkins', 'Git', 'Ansible', 'Terraform', 'Prometheus', 'ELK Stack'],
    'Cloud Computing': ['AWS', 'Azure', 'Google Cloud', 'Serverless', 'Microservices', 'Containerization', 'IaC'],
    'Cybersecurity': ['Network Security', 'Cryptography', 'Ethical Hacking', 'Penetration Testing', 'SIEM', 'Firewall Configuration'],
  });

  const handleFieldChange = (event) => {
    setCurrentField(event.target.value);
    setCurrentSkills([]);
  };

  const handleSkillToggle = (skill) => {
    setCurrentSkills(prevSkills =>
      prevSkills.includes(skill)
        ? prevSkills.filter(s => s !== skill)
        : [...prevSkills, skill]
    );
  };

  const handleSave = () => {
    if (currentField && currentSkills.length > 0) {
      setSkillSets(prevSets => [
        ...prevSets,
        { field: currentField, skills: currentSkills }
      ]);
      setCurrentField('');
      setCurrentSkills([]);
    }
  };

  const handleRemoveSkillSet = (index) => {
    setSkillSets(prevSets => prevSets.filter((_, i) => i !== index));
  };

  const handleAddNewField = () => {
    if (newField && !fields.includes(newField)) {
      setFields(prevFields => [...prevFields, newField]);
      setCurrentField(newField);
      setNewField('');
    }
  };

  const handleAddNewSkill = (index) => {
    const skillToAdd = newSkills[index];
    if (skillToAdd && !skillSets[index].skills.includes(skillToAdd)) {
      setSkillSets(prevSets => prevSets.map((set, i) => 
        i === index 
          ? { ...set, skills: [...set.skills, skillToAdd] }
          : set
      ));
      setNewSkills(prev => ({...prev, [index]: ''}));
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg border border-gray-200">      
      <div className="mb-6">
        <label htmlFor="field" className="block mb-2 text-sm font-medium text-gray-900">Select or Add a New Field</label>
        <select
          id="field"
          value={currentField}
          onChange={handleFieldChange}
          className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a field</option>
          {fields.map(field => (
            <option key={field} value={field}>{field}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={newField}
          onChange={(e) => setNewField(e.target.value)}
          placeholder="Enter new field"
          className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={handleAddNewField}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Add New Field
        </button>
      </div>

      {currentField && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Select Skills for {currentField}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {skillsByField[currentField]?.map(skill => (
              <div key={skill} className="flex items-center">
                <input
                  type="checkbox"
                  id={skill}
                  checked={currentSkills.includes(skill)}
                  onChange={() => handleSkillToggle(skill)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={skill} className="ml-2 text-sm font-medium text-gray-900">
                  {skill}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentField && currentSkills.length > 0 && (
        <button
          onClick={handleSave}
          className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Save Skills for {currentField}
        </button>
      )}

      {skillSets.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Saved Skill Sets</h3>
          {skillSets.map((set, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg relative">
              <h4 className="font-medium">{set.field}</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {set.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="flex items-center bg-blue-200 px-2 py-1 rounded-full">
                    <span className="text-sm">{skill}</span>
                    <button
                      onClick={() => {
                        setSkillSets(prevSets => prevSets.map((s, i) =>
                          i === index ? { ...s, skills: s.skills.filter((_, si) => si !== skillIndex) } : s
                        ));
                      }}
                      className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                      aria-label="Remove skill"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex">
                <input
                  type="text"
                  value={newSkills[index] || ''}
                  onChange={(e) => setNewSkills(prev => ({...prev, [index]: e.target.value}))}
                  placeholder="Enter new skill"
                  className="block w-1/2 p-1.5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => handleAddNewSkill(index)}
                  className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                  Add Skill
                </button>
              </div>

              <button
                onClick={() => handleRemoveSkillSet(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 focus:outline-none"
                aria-label="Remove skill set"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiFieldSkillsForm;