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




export const addPointToDescription = async (description, vague_statement) => {
    //make a post request to the server
    //send the description and vague statement
    //return the response

    console.log('Description:', description);
    console.log('Vague statement:', vague_statement);
    const response = await fetch(`${currentApiUrl}/add_point_to_description`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            description: description,
            vague_statement: vague_statement,
        }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.detailed_point;

};

export const rewriteDescription = async (description) => {
    //convert the

    const response = await fetch(`${currentApiUrl}/rewrite_description`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            description: description}),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const jsonString = data.bullet_points;
    console.log(jsonString);
    const descriptionArray = JSON.parse(jsonString);
    console.log(descriptionArray);
    return descriptionArray;
    
    };


    
    export const rewriteSpecificLine = async (selectedLine, selectedText, prompt,description) => {
        console.log('Selected line:', selectedLine);
        console.log('Selected text:', selectedText);
        console.log('Prompt:', prompt);
        console.log('Description:', description);

        const response = await fetch(`${currentApiUrl}/rewrite_specific_line`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                selectedText: selectedText,
                selectedLine: selectedLine,
                prompt: prompt || 'Rewrite the selected line.',
                description: description,
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.rewritten_text;
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

