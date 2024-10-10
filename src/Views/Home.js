import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../Models/authModel';
import BaseResume from './HomePage/BaseResume';
import CustomResume from './HomePage/CustomResume';
import { Sidebar, SidebarItem } from './SideBar';
import { Layout, FileText, LogOut, Brain } from 'lucide-react';
import LogOutPage from './HomePage/LogOut';
import FeedbackForm from './FeedbackForm';


const Home = () => {
  const [auth, setAuth] = useState(isAuthenticated());
  const [selectedOption, setSelectedOption] = useState('base');
  const navigate = useNavigate();


  useEffect(() => {
    if (!auth) {
      navigate('/login');
    }
  }, [auth, navigate]);

  const handleLogout = () => {
    logout();
    setAuth(false);
    navigate('/login');
  };

  const renderContent = () => {
    switch (selectedOption) {
      case 'base':
        return <BaseResume />;
      case 'customize':
        return <CustomResume />;
        case 'logout':
            return <LogOutPage />;

        case 'feedback':
            return <FeedbackForm />;
      default:
        return <h2 className="text-2xl font-bold">Select an option</h2>;
    }
  };

  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = (confirm) => {
    if (confirm) {
      handleLogout();
    }
    setShowConfirm(false);
  };

  return (
    <div className="flex">
      <Sidebar setSelectedOption={setSelectedOption}>
        <SidebarItem
          icon={<Layout size={20} />}
          text="Base Resume"
          option="base"
          active={selectedOption === 'base'}
        />
        <SidebarItem
          icon={<Brain size={20} />}
          text="Customize Resume"
          option="customize"
          active={selectedOption === 'customize'}
        />
        
        <SidebarItem
          icon={<FileText size={20} />}
          text="Feedback"
          option="feedback"
          active={selectedOption === 'feedback'}
        />


        <SidebarItem
          icon={<LogOut size={20} />}
          text="Logout"
          option="logout"
          active={false}
        />

      </Sidebar>
      <div className="flex-1 p-4">
        {renderContent()}
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg">
              <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
              <p className="mb-4">Are you sure you want to logout?</p>
              <div className="flex justify-end">
                <button 
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => confirmLogout(false)}
                >
                  Cancel
                </button>
                <button 
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => confirmLogout(true)}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;