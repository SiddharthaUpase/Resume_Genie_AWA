import { json } from "react-router-dom";
import currentApiUrl from "./apiUrl";


//a state to keep a track of the retry count
let retryCount = 0;


export const getResumes = async ( ) => {
    // Get the user ID from the authentication token
    const user_id = localStorage.getItem('session') ? JSON.parse(localStorage.getItem('session')).user_id : null;

    try {
        const response = await fetch(`${currentApiUrl}/get_resumes?user_id=${user_id}`, {
            method: 'GET', // Use the GET method
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.resumes;
        
    } catch (error) {
        if(retryCount < 10){
            retryCount++;
            return getResumes();
        }
        else{
            console.error('There was a problem with the fetch operation:', error);

        }
        
    }
};

export const getJsonResume = async (pdfText) => {

    if (!pdfText) {
        throw new Error('PDF text is required');
    }

    try {
        const response = await fetch(`${currentApiUrl}/get_json_resume`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ resume_text: pdfText }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.json_resume) {
            return data.json_resume;
        } else {
            throw new Error('JSON resume data not found in API response');
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};


export const deleteResume = async (resumeId) => {
    if (!resumeId) {
        throw new Error('Resume ID is required');
    }
    else{
        console.log(resumeId);
    }
    try {
        const response = await fetch(`${currentApiUrl}/delete_resume`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: resumeId }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.success) {
            return true;
        } else {
            throw new Error('Failed to delete resume');
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};


//write a function to get keywords from only a job description
export const getKeywords = async (jobDescription, resume_id) => {
    if (!jobDescription) {
        throw new Error('Job description is required');
    }

    if(!resume_id){
        throw new Error('Resume data is required');
    }

    try {
        const response = await fetch(`${currentApiUrl}/get_keywords`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ job_description: jobDescription,
                resume_id: resume_id 
             }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        

        if (data) {
            return data;
        } else {
            throw new Error('Keywords not found in API response');
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};

export const injectKeywords = async (resumeData, sections, keywords,summary) => {
    console.log('Summary:', summary);
    if (!resumeData) {
        throw new Error('Resume is required');
    }

    if (!sections) {
        throw new Error('Sections are required');
    }

    try {
        const response = await fetch(`${currentApiUrl}/inject_keywords`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ resume_data: resumeData, 
                sections: sections, 
                keywords: keywords,
                summary: summary
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        return data;

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}


export const getAllResumes = async (user_id) => {
    if (!user_id) {
        throw new Error('User ID is required');
    }

    try {
        const url = `${currentApiUrl}/get_all_resumes?user_id=${user_id}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const resumeArray = data.resumes.map((resume) => ({
            name: resume.name,
            id: resume._id.toString()
        }));

        console.log(resumeArray);
        return resumeArray;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};


export const getResume = async (resumeId) => {
    if (!resumeId) {
        throw new Error('Resume ID is required');
    }

    try {
        const response = await fetch(`${currentApiUrl}/get_resume?resume_id=${resumeId}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.resume) {
            return data.resume;
        } else {
            throw new Error('Resume not found in API response');
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}