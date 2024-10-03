import React from 'react';

const Card = ({ title, children }) => {
  return (
    <div className=" w-full h-full bg-white rounded-lg overflow-y-auto"  >
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default Card;