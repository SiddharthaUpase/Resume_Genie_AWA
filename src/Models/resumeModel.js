export const getResumes = async ( ) => {
    // Get the user ID from the authentication token
    const user_id = localStorage.getItem('session') ? JSON.parse(localStorage.getItem('session')).user_id : null;

    try {
        const response = await fetch(`https://flask-hello-world-two-dusky.vercel.app/get_resumes?user_id=${user_id}`, {
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