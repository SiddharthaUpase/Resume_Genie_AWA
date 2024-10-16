import React, { createContext, useContext, useReducer } from 'react';
import produce from 'immer';
const ResumeContext = createContext();
const initialResumeState = {
  personalInfo: { first_name: '', last_name: '', email: '', phone: '', location: '' },
  socials: [
    { platform: 'linkedin', url: '' },
    { platform: 'github', url: '' },
    { platform: 'portfolio', url: '' }
  ],
  education: [{ college: '', degree: '', startDate: '', endDate: '', courses: [], gpa: '', major: '', minor: '', location: '' }],
  workExperience: [{ jobTitle: '', company: '', startDate: '', endDate: '', description: '', location: '' }],
  projects: [{ title: '', description: '', link: '' }],
  skills: [],
  achievements: [{ title: '', description: '', date: '' }],
  sections: [
    { id: 0, name: 'Personal Info', emoji: '🧞' },
    { id: 1, name: 'Socials', emoji: '🧑‍💻' },
    { id: 2, name: 'Education', emoji: '🎓' },
    { id: 3, name: 'Work Exp.', emoji: '👔' },
    { id: 4, name: 'Projects', emoji: '🚀' },
    { id: 5, name: 'Skills', emoji: '🔧' },
    { id: 6, name: 'Achievements', emoji: '🏆' }
  ],
  name: '',
  keywords: [],
  jobDescription: ''
};
const resumeReducer = produce((draft, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      draft[action.payload.section][action.payload.field] = action.payload.value;
      break;
    case 'UPDATE_SECTION':
      draft[action.payload.section] = action.payload.data;
      break;
    case 'ADD_ITEM_TO_SECTION':
      draft[action.payload.section].push(action.payload.item);
      break;
    case 'REMOVE_ITEM_FROM_SECTION':
      draft[action.payload.section].splice(action.payload.index, 1);
      break;
    case 'UPDATE_ITEM_IN_SECTION':
      Object.assign(draft[action.payload.section][action.payload.index], action.payload.data);
      break;
    case 'SET_RESUME_STATE':
      return action.payload;
    default:
      break;
  }
});
export const ResumeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(resumeReducer, initialResumeState);
  const value = {
    resumeState: state,
    updateField: (section, field, value) => 
      dispatch({ type: 'UPDATE_FIELD', payload: { section, field, value } }),
    updateSection: (section, data) => 
      dispatch({ type: 'UPDATE_SECTION', payload: { section, data } }),
    addItemToSection: (section, item) => 
      dispatch({ type: 'ADD_ITEM_TO_SECTION', payload: { section, item } }),
    removeItemFromSection: (section, index) => 
      dispatch({ type: 'REMOVE_ITEM_FROM_SECTION', payload: { section, index } }),
    updateItemInSection: (section, index, data) => 
      dispatch({ type: 'UPDATE_ITEM_IN_SECTION', payload: { section, index, data } }),
    setResumeState: (newState) => 
      dispatch({ type: 'SET_RESUME_STATE', payload: newState })
  };
  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
};
export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};