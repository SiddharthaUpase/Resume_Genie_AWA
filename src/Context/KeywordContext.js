
import React, {createContext, useEffect, useState} from 'react';

const KeywordContext = createContext();

const KeywordProvider = ({children}) => {
    const [resumeData, setResumeData] = useState({});
    const [keywords, setKeywords] = useState([]);
    const [keywordOccurrences, setKeywordOccurrences] = useState({});
    const [selectedSections, setSelectedSections] = useState([]);
    useEffect(() => {
        console.log('Selected Sections:', selectedSections);
    }
    , [selectedSections]);

    //write  a useeffect that checks , when the selected sections are updated use the selected sections and iterate through thte resume data to get the descriptions of the selected sections and then look if any keywords are present in the descriptions and then update the keyword occurences state with the keywords and the number of times they occur in the selected sections

    useEffect(() => {   
        console.log('KeywordOccurrences:', keywordOccurrences);
    }
    , [keywordOccurrences]);

    return (
        <KeywordContext.Provider
            value={{resumeData, 
            setResumeData, 
            keywords, 
            setKeywords, 
            keywordOccurrences, 
            setKeywordOccurrences,
            selectedSections,
            setSelectedSections
            }}>
            {children}
        </KeywordContext.Provider>
    );
}
export {KeywordContext, KeywordProvider};