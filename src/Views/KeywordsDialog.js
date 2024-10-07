import React from 'react';
import { Dialog } from '@headlessui/react';

const KeywordsDialog = ({ isOpen, onClose, keywords, resumeKeywords }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black/30 z-20 " aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-20 ">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6">
          <Dialog.Title className="text-xl font-bold mb-4">Keywords</Dialog.Title>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => {
              const isInResume = resumeKeywords.includes(keyword.toLowerCase());
              return (
                <span
                  key={index}
                  className={`px-2 py-1 rounded-full text-white ${
                    isInResume ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}
                >
                  {keyword}
                </span>
              );
            })}
          </div>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
          >
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default KeywordsDialog;