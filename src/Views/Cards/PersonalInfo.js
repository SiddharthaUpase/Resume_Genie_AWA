// src/components/PersonalInfo.js
import React, { useEffect, useState } from 'react';

const PersonalInfo = ({ personal_info,onChange }) => {
 const [personalInfo, setPersonalInfo] = useState('');

  //set the fields to the values in the parent component
  useEffect(() => {
    setPersonalInfo(personal_info!==undefined?personal_info:{ first_name: '', last_name: '', email: '', phone: '', location: '' });
  }, [personal_info]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedInfo = { ...personalInfo, [name]: value };
    setPersonalInfo(updatedInfo);
    onChange(updatedInfo);
  };

  return (
    <div className="flex justify-center items-start ">
  <ul className="flex flex-col w-full space-y-4 list-disc border border-gray-200 rounded-lg p-8">
    <div>
      <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name</label>
      <input 
        type="text" 
        id="first_name" 
        name="first_name" 
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        placeholder="John" 
        value={personalInfo.first_name}
        onChange={handleChange} 
        required 
      />
    </div>
    <div>
      <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last name</label>
      <input 
        type="text" 
        id="last_name" 
        name="last_name" 
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        placeholder="Doe" 
        value={personalInfo.last_name}
        onChange={handleChange} 
        required 
      />
    </div>
    <div>
      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
      <input 
        type="email" 
        id="email" 
        name="email" 
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        placeholder="john@example.com" 
        value={personalInfo.email}
        onChange={handleChange} 
        required 
      />
    </div>
    <div>
      <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
      <input 
        type="tel" 
        id="phone" 
        name="phone" 
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        placeholder="123-45-678" 
        pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" 
        value={personalInfo.phone}
        onChange={handleChange} 
        required 
      />
    </div>
    <div>
      <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location</label>
      <input 
        type="text" 
        id="location" 
        name="location" 
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        placeholder="City, Country" 
        value={personalInfo.location}
        onChange={handleChange} 
        required 
      />
    </div>
  </ul>
</div>
  );
};

export default PersonalInfo;