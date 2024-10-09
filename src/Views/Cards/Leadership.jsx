import React, { useState } from 'react';

const Leadership = () => {
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
            <form onSubmit={handleSubmit}>
                <input type="text" value={inputValue} onChange={handleChange} />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Leadership;