import currentApiUrl from "./apiUrl";

export const getResumes = async ( ) => {
    // Get the user ID from the authentication token
    const user_id = localStorage.getItem('session') ? JSON.parse(localStorage.getItem('session')).user_id : null;

    try {
        console.log(currentApiUrl)
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
        console.log(data);
        return data.resumes;
        
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        
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


export const getResumeWithJobDescription = async (resume_id, jobDescription) => {
    if (!resume_id || !jobDescription) {
        throw new Error('Resume ID and job description are required');
    }

    try {
        const url = `${currentApiUrl}/get_resume?id=${resume_id}&job_description=${jobDescription}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Remove the id from the resume object
        delete data.resume.id;
        data.resume.name = '';

        return data.resume;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};


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