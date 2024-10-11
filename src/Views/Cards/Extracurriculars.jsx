import React, { useState } from 'react';

const Extracurriculars = () => {
    const [inputValue, setInputValue] = useState('');

    const handleInput = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <div>
            <input type="text" placeholder="Enter your extracurricular activities" value={inputValue} onChange={handleInput} />
        </div>
    );
};

export default Extracurriculars;