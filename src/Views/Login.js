import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../Models/authModel';
import { Linkedin,Mail } from 'lucide-react';


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
    

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Login</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username or Email</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
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
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>
                    <div className='flex flex-col space-y-2'>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
                    >
                        Login
                    </button>
                    <span className="text-center text-gray-500">or</span>

                    <button
                        type="button"
                        className="flex items-center justify-center w-full px-4 py-2 font-bold text-white rounded hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-200"
                        style={{ backgroundColor: '#f7b605' }}
                        onClick={() => {
                            // Handle Google login
                        }}
                    >
                        <Mail className="mr-2" /> Login with Google
                    </button>
                    <button
                        type="button"
                        className="flex items-center justify-center w-full px-4 py-2 font-bold text-white bg-blue-700 rounded hover:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-200"
                        onClick={() => {
                            // Handle LinkedIn login
                        }}
                    >
                        <Linkedin className="mr-2" /> Login with LinkedIn
                    </button>

                    </div>
                    <button
                        type='button'
                        className="w-full px-4 py-2 font-bold text-blue-600 bg-white border border-blue-600 rounded hover:bg-blue-50 focus:outline-none focus:ring focus:ring-blue-200"
                        onClick={() => {
                            navigate('/signup');
                        }}
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );

}

export default LoginView;