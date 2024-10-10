import React, { createContext, useState, useEffect } from 'react';

const ProgressInfoContext = createContext();

const ProgressInfoProvider = ({ children }) => {
const [progressInfo, setProgressInfo] = useState({
    filledStatus: new Map([
        [1, ['personalInfo', false]],
        [2, ['socials', false]],
        [3, ['education', false]],
        [4, ['workExperience', false]],
        [5, ['projects', false]],
        [6, ['skills', false]]
    ]),
    progressPercentage: 0,
    sectionsfilled: 0
});


    useEffect(() => {
        const totalFields = Object.keys(progressInfo.filledStatus).length;
        const filledFields = Object.values(progressInfo.filledStatus).filter(value => value).length;
        const percentage = Math.round((filledFields / totalFields) * 100);
        setProgressInfo(prevState => ({
            ...prevState,
            progressPercentage: percentage
        }));
    }, [progressInfo.filledStatus]);

    return (
        <ProgressInfoContext.Provider value={{ progressInfo, setProgressInfo }}>
            {children}
        </ProgressInfoContext.Provider>
    );
};

export { ProgressInfoContext, ProgressInfoProvider };