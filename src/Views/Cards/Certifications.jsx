import React, { useEffect, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, GripVerticalIcon } from 'lucide-react';

const CertificationsForm = ({ certifications_parent, onChange }) => {
  const [certifications, setCertifications] = useState(
    certifications_parent || [{
      id: Date.now(),
      name: '', 
      issuer: '', 
      dateObtained: '', 
      expirationDate: '', 
      credentialID: '', 
      credentialURL: '',
      description: ''
    }]
  );

  const [collapsed, setCollapsed] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    onChange(certifications);
  }, [certifications, onChange]);

  useEffect(() => {
    // Initialize collapsed state to true for each certification
    const initialCollapsed = {};
    certifications.forEach((_, index) => {
      initialCollapsed[index] = true;
    });
    setCollapsed(initialCollapsed);
  }, []);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    setCertifications(prevCertifications =>
      prevCertifications.map((cert, i) => i === index ? { ...cert, [name]: value } : cert)
    );
  };

  const handleAddCertification = () => {
    setCertifications(prev => [...prev, {
      id: Date.now(),
      name: '', 
      issuer: '', 
      dateObtained: '', 
      expirationDate: '', 
      credentialID: '', 
      credentialURL: '',
      description: ''
    }]);
    setCollapsed(prev => ({ ...prev, [certifications.length]: true }));
  };

  const handleRemoveCertification = (index) => {
    setCertifications(prevCertifications => prevCertifications.filter((_, i) => i !== index));
  };

  const handleCollapseToggle = (index) => {
    setCollapsed(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleDragStart = (index) => {
    setDraggedItem(index);
  };

  const handleDragOver = (index) => {
    if (draggedItem === index) return;
    const reorderedCertifications = Array.from(certifications);
    const [movedCertification] = reorderedCertifications.splice(draggedItem, 1);
    reorderedCertifications.splice(index, 0, movedCertification);
    setDraggedItem(index);
    setCertifications(reorderedCertifications);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const getPreviewText = (certification) => {
    let preview = certification.name;
    if (certification.issuer) {
      preview += ` - ${certification.issuer}`;
    }
    return preview || 'Untitled Certification';
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg border border-gray-200">
      {certifications.map((certification, index) => (
        <div
          key={certification.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={() => handleDragOver(index)}
          onDragEnd={handleDragEnd}
          className="mb-6 p-4 border border-gray-200 rounded-lg relative"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center flex-1">
              <div className="cursor-grab mr-2">
                <GripVerticalIcon className="h-5 w-5 text-gray-500" />
              </div>
              {collapsed[index] ? (
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{getPreviewText(certification)}</h3>
                </div>
              ) : null}
            </div>
            <div className="flex items-center">
              <button
                onClick={() => handleCollapseToggle(index)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none mr-2"
              >
                {collapsed[index] ? (
                  <ChevronDownIcon className="h-5 w-5" />
                ) : (
                  <ChevronUpIcon className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => handleRemoveCertification(index)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
                aria-label="Remove certification"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {!collapsed[index] && (
            <div className="space-y-4">
              <div>
                <label htmlFor={`name-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Certification Name</label>
                <input
                  type="text"
                  id={`name-${index}`}
                  name="name"
                  value={certification.name}
                  onChange={(e) => handleInputChange(index, e)}
                  className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., AWS Certified Solutions Architect"
                />
              </div>

              <div>
                <label htmlFor={`issuer-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Issuer</label>
                <input
                  type="text"
                  id={`issuer-${index}`}
                  name="issuer"
                  value={certification.issuer}
                  onChange={(e) => handleInputChange(index, e)}
                  className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Amazon Web Services"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`dateObtained-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Date Obtained</label>
                  <input
                    type="date"
                    id={`dateObtained-${index}`}
                    name="dateObtained"
                    value={certification.dateObtained}
                    onChange={(e) => handleInputChange(index, e)}
                    className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor={`expirationDate-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Expiration Date</label>
                  <input
                    type="date"
                    id={`expirationDate-${index}`}
                    name="expirationDate"
                    value={certification.expirationDate}
                    onChange={(e) => handleInputChange(index, e)}
                    className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`credentialID-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Credential ID</label>
                <input
                  type="text"
                  id={`credentialID-${index}`}
                  name="credentialID"
                  value={certification.credentialID}
                  onChange={(e) => handleInputChange(index, e)}
                  className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., ABC123XYZ"
                />
              </div>

              <div>
                <label htmlFor={`credentialURL-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Credential URL</label>
                <input
                  type="url"
                  id={`credentialURL-${index}`}
                  name="credentialURL"
                  value={certification.credentialURL}
                  onChange={(e) => handleInputChange(index, e)}
                  className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://www.example.com/verify/ABC123XYZ"
                />
              </div>

              <div>
                <label htmlFor={`description-${index}`} className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                <textarea
                  id={`description-${index}`}
                  name="description"
                  value={certification.description}
                  onChange={(e) => handleInputChange(index, e)}
                  rows="3"
                  className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Briefly describe the certification and its relevance"
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleAddCertification}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Add Certification
      </button>
    </div>
  );
};

export default CertificationsForm;