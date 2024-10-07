import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../Models/authModel';

const LoginView = ()=>{

    const [userName,setUserName] = useState('');
    const [password,setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response  = await login(userName,password);
        if(!response.success){
            return setError(response.message);

        }
        
        navigate('/home');

        
        
    };
    const handleGoogleLogin = () => {
        // Placeholder for Google login functionality
        console.log('Google login clicked');
        setError('Google login not implemented in this demo.');
    };

    const handleCreateAccount = () => {
   
        console.log('Create account clicked');
        navigate('/signup');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">

        <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-800 archivo-black-regular">🧞ResumeGenie</h1>
        </div>
            <h2 className="text-2xl font-bold text-center">Login</h2>
            
            {error && <p className="text-red-500 text-center">{error}</p>}
            
            <button 
                onClick={handleGoogleLogin}
                className="w-full py-2 px-4 border flex justify-center items-center text-gray-700 rounded-md hover:bg-gray-100 transition duration-150"
            >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
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
                    <label className="block text-sm font-medium text-gray-700">Username or Email</label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your Email or Username"
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
                        placeholder="Enter your password"
                        className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                </div>
                <div className="text-right">
                    <a href="#" className="text-sm text-blue-600 hover:underline">Forgot Password?</a>
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 font-bold text-white bg-gray-800 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                    Login
                </button>
            </form>
            
            <div className="text-center text-sm">
                Don't have an account yet? <a href="/signup" className="text-blue-600 hover:underline">Create for free</a>
            </div>
        </div>
    </div>
    );

}

export default LoginView;