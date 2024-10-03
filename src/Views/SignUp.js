import { useState } from 'react';
import React  from 'react';
import { signUp } from '../Models/authModel';






const SignUpView = ()=>{
    const [userName,setUserName] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [email,setEmail] = useState('');
    const [name,setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        
        e.preventDefault();

        if(password !== confirmPassword){
            setError("Passwords do not match");
            return;
        }
        const response  = await signUp(name,email,userName,password);

        if(response.success){
            alert("Sign Up Successful");
        }
        
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-pink-100">
            <div className="w-full max-w-md p-8 space-y-10 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold text-center">Sign Up</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                            required
                        />
                    </div>
                    
                    
                    
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
                    >
                        Sign Up
                    </button>

                    <button
                        type="button"
                        onClick={() => window.location.href = '/login'}
                        className="w-full px-4 py-2 font-bold text-indigo-600 bg-white border border-indigo-600 rounded hover:bg-indigo-100 focus:outline-none focus:ring focus:ring-indigo-200"
                    >
                        Go to Login
                    </button>


                </form>
            </div>
        </div>
    );
}
export default SignUpView;