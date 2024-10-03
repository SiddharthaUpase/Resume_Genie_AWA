import React from 'react';

const LogOutPage = () => {
    const handleLogOut = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            
            //navigate to the home and remove the session
            localStorage.removeItem('session');
            window.location.href = '/login';
        }
    };

    return (
        <div className="pl-4 pt-4 flex justify-start items-start h-screen bg-white shadow-lg">
            <button 
                className="px-4 py-2 text-lg text-white bg-blue-500 rounded shadow-md hover:bg-blue-600 focus:outline-none"
                onClick={handleLogOut}
            >
                Log Out
            </button>
        </div>
    );
};

export default LogOutPage;
