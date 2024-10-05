
import currentApiUrl from "./apiUrl";

export const sendFeedback = async (payload)=> {
    const response = await fetch(`${currentApiUrl}/store_suggestions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    console.log(response);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }


    return response;
}

