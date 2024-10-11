import React, { createContext } from 'react';
//This only a read only ocntext
const SectionsListContext = createContext([]);

const SectionsListProvider = ({ children }) => {
    const sectionsList = [
        { id: 0, name: 'Personal Info', emoji: '🧞' },
        { id: 1, name: 'Socials', emoji: '🧑‍💻' },
        { id: 2, name: 'Education', emoji: '🎓' },
        { id: 3, name: 'Work Exp.', emoji: '👔' },
        { id: 4, name: 'Projects', emoji: '🚀' },
        { id: 5, name: 'Skills', emoji: '🔧' },
        { id: 6, name: 'Achievements', emoji: '🏆' },
        { id: 7, name: 'Certifications', emoji: '📜' },
        { id: 8, name: 'Leadership', emoji: '👨‍👧‍👦' },
        { id: 9, name: 'Extracurriculars', emoji: '🎭' }
    ];

    const mandatorySections = [
        { id: 0, name: 'Personal Info', emoji: '🧞' },
        { id: 1, name: 'Socials', emoji: '🧑‍💻' },
        { id: 2, name: 'Education', emoji: '🎓' },
        { id: 3, name: 'Work Exp.', emoji: '👔' },
        { id: 4, name: 'Projects', emoji: '🚀' },
        { id: 5, name: 'Skills', emoji: '🔧' }
    ];

    return (
        <SectionsListContext.Provider value={{ sectionsList, mandatorySections }}>
            {children}
        </SectionsListContext.Provider>
    );
};

export { SectionsListContext, SectionsListProvider };