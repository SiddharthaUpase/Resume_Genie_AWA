import React, { useState, useEffect,useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../Views/Home'; // Assuming Home component is in the same directory
import LoginView from '../Views/Login'; // Assuming LoginView component is in the same directory
import SignUpView from '../Views/SignUp'; // Assuming SignUpView component is in the same directory
import { login, logout } from '../Models/authModel'; // Assuming login and logout functions are in the same directory
import AddInfoPage from '../Views/AddInfoPage';
import Resume from '../Views/ResumeReview';
import { ProgressInfoProvider } from '../Context/ProgressInfoContext';

function App() {
  const [auth, setAuth] = useState(false);

  const handleLogin = async (credentials) => {
    const result = await login(credentials); // Replace with actual login logic
    if (result.success) {
      setAuth(true);
    }
    return result;
  };

  const handleLogout = () => {
    logout(); // Replace with actual logout logic
    setAuth(false);
  };

  useEffect(() => {
    if (auth) {
      console.log("User is logged in");
      // You can navigate to a protected route or dashboard here
    }
  }, [auth]);

  return (
    <ProgressInfoProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginView onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUpView />} />
        <Route path= "/addInfo" element={<AddInfoPage />} />
        <Route path= "/resume-review" element={<Resume />} />
      </Routes>
    </Router>
    </ProgressInfoProvider> 
  );
}

export default App;