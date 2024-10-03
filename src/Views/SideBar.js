import React, { createContext, useContext, useEffect, useState } from 'react';
import { ChevronFirst, ChevronLast, MoreVertical } from 'lucide-react';

const SidebarContext = createContext();



export const Sidebar = ({ children, setSelectedOption }) => {
    const [expanded, setExpanded] = useState(true);
    const [userDetails, setUserDetails] = useState({});

    const getUserDetails = async () => {
        const user = JSON.parse(localStorage.getItem('session'));

        try {
            const url = `https://flask-hello-world-two-dusky.vercel.app/get_user?user_id=${user.user_id}`;
            const response = await fetch(url);
            const data = await response.json();
            setUserDetails(data.user);
            console.log(data.user);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const getInitials = (name) => {
        return name.split(' ').map(word => word[0]).join('');
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    return (
        <aside className="h-screen">
            <nav className="h-full flex flex-col bg-gray-800 text-white border-r shadow-sm">
                <div className="p-4 pb-2 flex justify-between items-center">
                    <h1 className={`text-xl font-semibold overflow-hidden transition-all  ${expanded ? "w-40" : "w-0"
                        }`}>🧞ResumeGenie</h1>
                    <button
                        onClick={() => setExpanded((curr) => !curr)}
                        className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600"
                    >
                        {expanded ? <ChevronFirst /> : <ChevronLast />}
                    </button>
                </div>

                <SidebarContext.Provider value={{ expanded, setSelectedOption }}>
                    <ul className="flex-1 px-3">{children}</ul>
                </SidebarContext.Provider>

                <div className="border-t border-gray-700 flex p-3">
                    <div
                        className="w-10 h-10 rounded-md bg-indigo-200 text-indigo-900 flex items-center justify-center font-bold"
                    >
                        {userDetails.name ? getInitials(userDetails.name) : ''}
                    </div>
                    <div
                        className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}
                    >
                        <div className="leading-4">
                            <h4 className="font-semibold">{userDetails.name}</h4>
                            <span className="text-xs text-gray-400">{userDetails.email}</span>
                        </div>

                    </div>
                </div>
            </nav>
        </aside>
    );
};




export const SidebarItem = ({ icon, text, option, active }) => {
    const { expanded, setSelectedOption } = useContext(SidebarContext);

    return (
        <li
            onClick={() => setSelectedOption(option)}
            className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${active
                    ? "bg-gray-700 text-white"
                    : "hover:bg-gray-700 text-gray-400"
                }
    `}
        >
            {icon}
            <span
                className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"
                    }`}
            >
                {text}
            </span>

            {!expanded && (
                <div
                    className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-gray-100 text-gray-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
                >
                    {text}
                </div>
            )}
        </li>
    );
};