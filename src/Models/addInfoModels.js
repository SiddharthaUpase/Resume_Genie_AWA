import currentApiUrl from "./apiUrl";


export const rewriteAchievement = async (achievement) => {

    if (!achievement) {
        throw new Error('Achievement is required');
    }
    else{
        console.log(achievement);
    }

    const response = await fetch(`${currentApiUrl}/rewrite_achievement`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ achievement }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.achievement;
};


export const rewriteProjectDescription = async (description, customPrompt) => {
    const response = await fetch(`${currentApiUrl}/rewrite_project_description`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            project_description: description,
            prompt: customPrompt || 'Rewrite the project description in bullet points format.',
        }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.project_description;
};

export const rewriteWorkDescription = async (description, customPrompt) => {
    //convert the

    const response = await fetch(`${currentApiUrl}/rewrite_description`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            description: description,
            prompt: customPrompt ? encodeURIComponent(customPrompt) : 'Rewrite the project description in bullet points format.',        }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.bullet_points;
};


export const storeResume = async (newResume, set_id) => {
    if(!set_id){
        throw new Error('set_id is required');
    }


    try {
        const response = await fetch(`${currentApiUrl}/store_resume`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newResume)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log(result);
        if (result.id) {
            set_id(result.id);
        }
    } catch (error) {
        console.error('Error storing resume:', error);
        throw error;
    }
};

