import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../Models/authModel';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; // Updated import statement


const LoginView = ()=>{

    const [userName,setUserName] = useState('');
    const [password,setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const google_signin = false;
        const response  = await login(userName,password,google_signin);
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
        <p className="text-center text-gray-600">Streamline your Resume Generation experience with the power of AI.</p>

            <h2 className="text-2xl font-bold text-center">Login</h2>
            
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
                            const google_signin = true;
                            const password = 'password';
                            const confirmPassword = 'password';
                            
                            const response = await login(email,password,google_signin,name);
                            if(response.success){
                                navigate('/home');
                            }
                            else{
                                alert(response.message);
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