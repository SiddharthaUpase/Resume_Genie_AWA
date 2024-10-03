import React from "react";
import { useState } from "react";


const Socials = ({social_info, onChange}) => {

    const [socials, setSocials] = useState(social_info!==undefined?social_info:{linkedin: '', github: '', portfolio: ''});

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedInfo = { ...socials, [name]: value };
        setSocials(updatedInfo);
        onChange(updatedInfo);
    }



    return (
        <div className="flex justify-center items-start ">
            <ul className="flex flex-col w-full max-w-xl space-y-4 list-disc border border-gray-200 rounded-lg p-8">
                <div>
                    <label htmlFor="linkedin" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">LinkedIn ID</label>
                    <input type="url"
                        value={socials.linkedin}
                        id="linkedin" name="linkedin" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="https://www.linkedin.com/in/miachael-scott-a6963617a/" required onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="github" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">GitHub Link</label>
                    <input type="url"
                        value={socials.github}
                        id="github" name="github" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="https://github.com/username" required onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="other" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Portfolio Link</label>
                    <input type="url"
                        value={socials.portfolio}
                        id="other" name="portfolio" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="portfolio link" required onChange={handleChange} />
                </div>
            </ul>
        </div>
    )
     

}
export default Socials;