import { useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import React  from 'react';
import { signUp } from '../Models/authModel';
import { nav } from 'framer-motion/client';






const SignUpView = ()=>{
    const [userName,setUserName] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [email,setEmail] = useState('');
    const [name,setName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
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

    const handleGoogleSignUp = () => {
        // Placeholder for Google sign up functionality
        console.log('Google sign up clicked');
        setError('Google sign up not implemented in this demo.');
    };

    const handleLogin = () => {
        // Placeholder for login functionality
        console.log('Login clicked');
        navigate('/login');
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-gray-800 archivo-black-regular">🧞ResumeGenie</h1>
                </div>
                <h2 className="text-3xl font-bold text-center">Create Free Account</h2>
                <p className="text-center text-gray-600">Streamline your Resume Generation experience with the power of AI.</p>
                
                {error && <p className="text-red-500 text-center">{error}</p>}
                
                <button 
                    onClick={handleGoogleSignUp}
                    className="w-full py-2 px-4 border flex justify-center items-center text-gray-700 rounded-md hover:bg-gray-100 transition duration-150"
                >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        <path fill="none" d="M1 1h22v22H1z" />
                    </svg>
                    Continue with Google
                </button>
                
                <div className="flex items-center justify-between">
                    <hr className="w-full border-gray-300" />
                    <span className="px-2 text-gray-500">or</span>
                    <hr className="w-full border-gray-300" />
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Choose a username"
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create strong password"
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-white bg-gray-800 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    >
                        Create Free Account
                    </button>
                </form>
                
                <div className="text-center text-sm">
                    Already have an account? <a href="/login" className="text-blue-600 hover:underline">Log In</a>
                </div>
{/* 
                <div className="text-center text-xs text-gray-500">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </div> */}

 
            </div>
        </div>
    );
}
export default SignUpView;