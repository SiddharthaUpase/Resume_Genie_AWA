import { useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import React  from 'react';
import { signUp } from '../Models/authModel';
import { nav } from 'framer-motion/client';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; // Updated import statement







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
            navigate('/home');
        }
        else{
            alert(response.message);
           setError(response.message);
        }
        
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
                <div className="flex justify-center">
                <GoogleLogin
                    onSuccess={async credentialResponse => {
                        
                       const decodedToken = jwtDecode(credentialResponse.credential);
                          //extract the user's email, given_name, and family_name from the decoded token
                            const email = decodedToken.email;
                            const given_name = decodedToken.given_name;
                            const family_name = decodedToken.family_name;
                            const name = given_name + ' ' + family_name;
                            const username = email.split('@')[0];
                            const password = 'password';
                            const confirmPassword = 'password';
                            const response = await signUp(name,email,username,password);
                            if(response.success){
                                navigate('/home');
                            }
                            else{
                                alert(response.message + ' Please try Loging In');
                               setError(response.message);
                            }


                    }}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                />

                    </div>
                
               
                
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