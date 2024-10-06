import React, { useEffect, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, GripVerticalIcon } from 'lucide-react'

const MultiFieldSkillsForm = ({ skill_sets = [], onChange }) => {
  const [skillSets, setSkillSets] = useState(() => {
    return skill_sets.length > 0
      ? skill_sets.map(([field, skills]) => ({ field, skills, isOpen: true }))
      : [];
  });
  const [currentField, setCurrentField] = useState('');
  const [currentSkills, setCurrentSkills] = useState([]);
  const [newField, setNewField] = useState('');
  const [newSkills, setNewSkills] = useState({});
  const [draggedSkillIndex, setDraggedSkillIndex] = useState(null);
  const [draggedOverSkillIndex, setDraggedOverSkillIndex] = useState(null);
  const [draggedSetIndex, setDraggedSetIndex] = useState(null);

  useEffect(() => {
    //all the skills in the sets should not be open by default
    setSkillSets(prevSets => prevSets.map(set => ({ ...set, isOpen: false })));
  }, []);




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
        { field: currentField, skills: currentSkills, isOpen: true }
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
      setNewSkills(prev => ({ ...prev, [index]: '' }));
    }
  };

  const handleDragStart = (e, skillIndex) => {
    setDraggedSkillIndex(skillIndex);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, skillIndex) => {
    e.preventDefault();
    setDraggedOverSkillIndex(skillIndex);
  };

  const handleDrop = (e, setIndex) => {
    e.preventDefault();
    if (draggedSkillIndex === null || draggedOverSkillIndex === null) return;

    const newSkillSets = [...skillSets];
    const set = { ...newSkillSets[setIndex] };
    const skills = [...set.skills];

    const [draggedSkill] = skills.splice(draggedSkillIndex, 1);
    skills.splice(draggedOverSkillIndex, 0, draggedSkill);

    set.skills = skills;
    newSkillSets[setIndex] = set;
    setSkillSets(newSkillSets);

    setDraggedSkillIndex(null);
    setDraggedOverSkillIndex(null);
  };

  const toggleSkillSet = (index) => {
    setSkillSets(prevSets => prevSets.map((set, i) =>
      i === index ? { ...set, isOpen: !set.isOpen } : set
    ));
  };

  const handleDragStartSet = (e, index) => {
    setDraggedSetIndex(index);
    e.dataTransfer.setData('application/x-skill-set', index.toString());
  };
  
  const handleDragOverSet = (e, index) => {
    e.preventDefault();

  };

const handleDropSet = (e, targetIndex) => {
  e.preventDefault();
  const sourceIndex = draggedSetIndex;

  // Remove visual feedback
  e.currentTarget.classList.remove('drag-over');

  // Return null if targetIndex is not set
  if (targetIndex === null || targetIndex === undefined) {
    setDraggedSetIndex(null);
    return null;
  }

  if (sourceIndex !== null && sourceIndex !== targetIndex) {
    setSkillSets(prevSets => {
      const newSets = [...prevSets];
      // Store the sets that will be swapped
      const sourceSet = { ...newSets[sourceIndex] };
      const targetSet = { ...newSets[targetIndex] };

      // Perform the swap
      newSets[targetIndex] = sourceSet;
      newSets[sourceIndex] = targetSet;

      return newSets;
    });
  }

  setDraggedSetIndex(null);
};

const handleDragEndSet = () => {
  // Clear any visual feedback
  document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
  setDraggedSetIndex(null);
};

const handleDragLeaveSet = (e) => {
  // Remove visual feedback
  e.currentTarget.classList.remove('drag-over');
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

{skillSets.map((set, index) => (
  <div 
  key={index}
  data-index={index} // Add data attribute for index
  draggable
  onDragStart={(e) => handleDragStartSet(e, index)}
  onDragOver={(e) => handleDragOverSet(e, index)}
  onDragLeave={handleDragLeaveSet}
  onDrop={(e) => handleDropSet(e, index)} // Pass index directly
  onDragEnd={handleDragEndSet}
  className={`relative p-4 border border-gray-200 rounded-lg ${
    draggedSetIndex === index ? 'opacity-40' : ''
  } ${
    draggedSetIndex !== null && draggedSetIndex !== index ? 'drag-target' : ''
  }`}
>
    <div className="flex justify-start items-center space-x-4">
      <GripVerticalIcon 
        className="h-5 w-5 text-gray-500 ml-2 cursor-move" 
      />
      <button
        onClick={() => toggleSkillSet(index)}
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Toggle skill set"
      >
        {set.isOpen ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
      </button>
      <h4 className="font-medium">{set.field}</h4>
    </div>
    
    {set.isOpen && (
      <>
        <div className="flex flex-wrap gap-2 mt-2">
          {set.skills.map((skill, skillIndex) => (
            <div
              key={skill}
              draggable
              onDragStart={(e) => {
                e.stopPropagation(); // Prevent parent set drag
                handleDragStart(e, skillIndex);
                // Set a data transfer type to identify skill dragging
                e.dataTransfer.setData('application/x-skill', 'true');
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent parent set drag over
                // Only handle skill drag if we're dragging a skill
                if (e.dataTransfer.types.includes('application/x-skill')) {
                  handleDragOver(e, skillIndex);
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent parent set drop
                // Only handle skill drop if we're dropping a skill
                if (e.dataTransfer.types.includes('application/x-skill')) {
                  handleDrop(e, index);
                }
              }}
              className="flex items-center bg-gradient-to-l from-blue-400 to-blue-600 text-white px-3 py-1 rounded-full shadow-md cursor-grab transition-transform transform hover:scale-105"
            >
              <span className="text-sm font-semibold">{skill}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event bubbling
                  setSkillSets(prevSets => prevSets.map((s, i) =>
                    i === index ? { ...s, skills: s.skills.filter((_, si) => si !== skillIndex) } : s
                  ));
                }}
                className="ml-2 text-red-200 hover:text-red-400 focus:outline-none"
                aria-label="Remove skill"
              >
                <span style={{ fontSize: '0.75rem' }}>❌</span>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex">
          <input
            type="text"
            value={newSkills[index] || ''}
            onChange={(e) => setNewSkills(prev => ({ ...prev, [index]: e.target.value }))}
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
      </>
    )}
    
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevent event bubbling
        handleRemoveSkillSet(index);
      }}
      className="absolute top-2 right-2 text-red-500 hover:text-red-700 focus:outline-none"
      aria-label="Remove skill set"
    >
      <span style={{ fontSize: '0.75rem' }}>❌</span>
    </button>
  </div>
))}
    </div>
  );
};

export default MultiFieldSkillsForm;