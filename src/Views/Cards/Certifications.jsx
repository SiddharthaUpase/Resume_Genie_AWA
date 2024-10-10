import React, { useState } from 'react';

const Certifications = () => {
    const [inputValue, setInputValue] = useState('');

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Submitted value:', inputValue);
    };

    return (
        <div>
            <h1>Test Input Form</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Input:
                    <input type="text" value={inputValue} onChange={handleChange} />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Certifications;