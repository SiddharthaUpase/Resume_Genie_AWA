import React, { useState, useEffect,useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../Views/Home Section/Home'; // Assuming Home component is in the same directory
import LoginView from '../Views/Authentication/Login'; // Assuming LoginView component is in the same directory
import SignUpView from '../Views/Authentication/SignUp'; // Assuming SignUpView component is in the same directory
import { login, logout } from '../Models/authModel'; // Assuming login and logout functions are in the same directory
import AddInfoPage from '../Views/AddInfoPage/AddInfoPage';
import Resume from '../Views/ResumeReview';
import { ProgressInfoProvider } from '../Context/ProgressInfoContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SectionsListProvider } from '../Context/SectionsListContext';
import { ResumeProvider } from '../Context/ResumeContext';
import {KeywordProvider} from '../Context/KeywordContext';
import CustomResume from '../Views/Home Section/Pages/CustomResume';
import KeywordManagement from '../Views/Home Section/KeywordManagement/KeywordManagement';
import SectionSelection from '../Views/Home Section/KeywordManagement/SectionSelection';

function App() {
  const [auth, setAuth] = useState(false);


  return (
    <GoogleOAuthProvider clientId="787439220358-5b3j7h7k5hglclbr150ii4pq38lo5r8k.apps.googleusercontent.com">
    <ProgressInfoProvider>
    <SectionsListProvider>
    <ResumeProvider>
    <KeywordProvider>  
    <Router>
      <Routes>
        <Route path="/" element={<LoginView />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/signup" element={<SignUpView />} />
        <Route path= "/addInfo" element={<AddInfoPage />} />
        <Route path= "/resume-review" element={<Resume />} />
        <Route path="/custom" element={<CustomResume />} />
        <Route path="/keywordManage"   element={<KeywordManagement />} />
        <Route path= "/selectSections" element={<SectionSelection/>} />
      </Routes>
    </Router>
    </KeywordProvider>
    </ResumeProvider>
    </SectionsListProvider>
    </ProgressInfoProvider> 
    
    </GoogleOAuthProvider>
  );
}

export default App;