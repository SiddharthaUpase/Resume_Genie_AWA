import React from 'react';

const LogOutPage = () => {
    const handleLogOut = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            // Navigate to the home and remove the session
            localStorage.removeItem('session');
            window.location.href = '/login';
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-semibold mb-4">Log Out</h1>
                <p className="mb-6">Are you sure you want to log out?</p>
                <button 
                    className="w-full px-4 py-2 text-lg text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none"
                    onClick={handleLogOut}
                >
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default LogOutPage;