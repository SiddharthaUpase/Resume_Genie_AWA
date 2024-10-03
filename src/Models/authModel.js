

export const login = async (username, password) =>{

    try {
        const response = await fetch('https://flask-hello-world-two-dusky.vercel.app/login_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                user_name: username,
                password: password
             })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }


        const data = await response.json();



        if (data.success) {

            // Create a session object with user_id and current time
        const session = { user_id: data.user_id, time: new Date().getTime() };
        
        // Store the session object in local storage
        localStorage.setItem("session", JSON.stringify(session));
        
        // Set isAuthenticated to true
        localStorage.setItem("isAuthenticated", true);

        

            return { success: true };
        } else {
            return { success: false, message:  'Login failed' };
        }

    }
    catch (error) {
        return { success: false, message: 'Invalid credentials' };
    }
}


export const logout= ()=>{
    localStorage.removeItem("isAuthenticated");
};

export const isAuthenticated = ()=>{
    return !!localStorage.getItem("isAuthenticated");
}

export const signUp = async (name,email,username, password) => {
    try {
        const response = await fetch('https://flask-hello-world-two-dusky.vercel.app/create_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                name: name,
                email: email,
                user_name: username,
                password: password
             })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.success) {
               // Create a session object with user_id and current time
        const session = { user_id: data.user_id, time: new Date().getTime() };
        
        // Store the session object in local storage
        localStorage.setItem("session", JSON.stringify(session));
        
        // Set isAuthenticated to true
        localStorage.setItem("isAuthenticated", true);
            return { success: true };
        } else {
            return { success: false, message: data.message || 'Signup failed' };
        }
    } catch (error) {
        return { success: false, message: error.message || 'An error occurred' };
    }
};