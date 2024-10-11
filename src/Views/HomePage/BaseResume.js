import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PdfUploadDialog from '../UploadPopUp';
import pdfToText from 'react-pdftotext';
import { getResumes } from '../../Models/resumeModel';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { motion } from 'framer-motion';
import { PlusCircle, Eye, Edit, Trash2, FileText, Cpu, Brain, FileArchive } from 'lucide-react';
import { getJsonResume, deleteResume } from '../../Models/resumeModel';
import{useResume} from '../../Context/ResumeContext';
const BaseResume = () => {
  const [resume_data, setResume_data] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [pdfText, setPdfText] = useState('');
  const [isloading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [jsonString, setJsonString] = useState('');
  const [convertedString, setConvertedString] = useState('');

  const {setResumeState} = useResume();

  const wittyLoadingStatements = [
    'Hold tight, genius at work...',
    'Cooking up your resume magic...',
    'Resume wizardry in progress...',
    'Hang on, making you look awesome...',
    'Brewing your career potion...',
    'Just a sec, making you shine...',
    'Hold on, crafting your resume...',
    'Just a moment, making you stand out...',
    'Polishing your professional profile...',
    'Adding some sparkle to your resume...',
    'Transforming your skills into magic...',
    'Turning your experience into gold...',
    'Making your resume irresistible...',
    'Crafting your career masterpiece...',
    'Shaping your future, one word at a time...',
    'Extracting brilliance from your experience...',
    'Scanning for awesomeness...',
    'Compiling your career highlights...',
    'Gathering your professional prowess...',
    'Processing your job history with flair...',
    'Reviewing your qualifications with a smile...',
    'Summarizing your expertise, hold tight...',
    'Organizing your resume details, almost there...',
    'Refining your career story, stay tuned...',
    'Highlighting your strengths, just a moment...',
    'Evaluating your credentials, please wait...',
    'Synthesizing your work history, hang on...',
    'Curating your professional journey, nearly done...',
    'Assembling your career profile, just a sec...',
];
  const [currentStatement, setCurrentStatement] = useState(wittyLoadingStatements[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatement(wittyLoadingStatements[Math.floor(Math.random() * wittyLoadingStatements.length)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!convertedString) return;
    const data = convertedString;
    navigate('/addInfo', { state: { data } });
  }, [convertedString, navigate]);

  useEffect(() => {
    const getResumesData = async () => {
      const data = await getResumes();
      if (data) {
        setResume_data(data);
        console.log(data);
      }
    };
    getResumesData();
  }, []);

  useEffect(() => {
    if (jsonString) {
      try {
        const data = JSON.parse(jsonString);
        setConvertedString(data);
      } catch (error) {
        console.error('Invalid JSON string:', error);
      }
    }
  }, [jsonString]);

  useEffect(() => {
    const extractText = async () => {
      if (file) {
        try {
          const text = await pdfToText(file);
          setPdfText(text);
        } catch (err) {
          console.error('Error extracting text from PDF:', err);
        }
      }
    };

    extractText();
  }, [file]);

  useEffect(() => {
    setIsDialogOpen(false);
    console.log(pdfText);
    const fetchJsonResume = async () => {
      if (pdfText) {
        setIsLoading(true);
        try {
          const jsonResume = await getJsonResume(pdfText);
          setJsonString(jsonResume);
          console.log(jsonResume);
        } catch (error) {
          console.error('Error fetching JSON resume:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchJsonResume();
  }, [pdfText]);

  const onExtract = async (file) => {
    setFile(file);
    // The API call will be triggered by the useEffect hook when pdfText is updated
  };

  const handleDialog = (confirm) => {
    setShowDialog(confirm);
  };

  const handleCreateWithAI = () => {
    navigate('/addInfo');
  };

  const handleEditResume = (resumeId) => {
    const data = resume_data[resumeId];
    navigate('/addInfo', { state: { data } });
    //implelemt with use resumehhok
    setResumeState(data);

  };

  const handleViewResume = (resumeId) => {
    const data = resume_data[resumeId];
    console.log(data);
    navigate('/resume-review', { state: { data } });
  };

  const handleUploadResume = () => {
    handleDialog(false);
    setIsDialogOpen(true);
  };

  const onFileSelect = async (file) => {
    // Implement file selection logic
  };

  const handleDeleteResume = async (resumeId) => {
    
    setOpen(false);
    try{
      const response = await deleteResume(resume_data[resumeId]._id);
      if(response){
        const newResumes = resume_data.filter((_, index) => index !== resumeId);
        setResume_data(newResumes);
      }

    }
    catch(error){
      console.error('Error deleting resume:', error);
    }

  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Resumes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resume_data.map((resume, index) => (
          <motion.div
            key={resume._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-6">
              
              <div className='flex justify-between'>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">{resume.name}</h2>
                {resume.keywords && (
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                    title="Keyword optimized"
                  >
                    <Brain size={24} className="ml-2 text-yellow-500" />
                  </motion.div>
                )}
                {!resume.keywords && (
                  <div title="Base Resume">
                  
                  <FileArchive size={24} className="ml-2 text-gray-500" />
                  </div>
                  
                )}

              </div>
              <div className="flex justify-start space-x-4 ">
                <button
                  onClick={() => handleViewResume(index)}
                  className="flex items-center px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                  title='View Resume'
                >
                  <Eye size={18}  />
                </button>
                <button
                  onClick={() => handleEditResume(index)}
                  className="flex items-center px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200"
                  title='Edit Resume'
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => {
                    setOpen(true);
                    setCurrentIndex(index);
                  }}
                  className="flex items-center px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                  title='Delete Resume'
                >
                  <Trash2 size={18}  />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        <motion.div
          className="bg-blue-500 rounded-lg shadow-md overflow-hidden cursor-pointer"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
          onClick={() => handleCreateWithAI()}
        >
          <div className="p-6 flex flex-col items-center justify-center h-full text-white">
            <PlusCircle size={48} className="mb-4" />
            <span className="text-xl font-semibold">Create New Resume</span>
          </div>
        </motion.div>
      </div>

      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-lg shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Choose an option:</h2>
            <div className="space-y-4">
              <button
                className="w-full flex items-center justify-center px-4 py-3 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 transition duration-200"
                onClick={handleCreateWithAI}
              >
                <Cpu size={24} className="mr-3" />
                Create Resume with AI
              </button>
              <button
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition duration-200"
                onClick={handleUploadResume}
              >
                <FileText size={24} className="mr-3" />
                Use Existing Resume
              </button>
              <button
                onClick={() => handleDialog(false)}
                className="w-full flex items-center justify-center px-4 py-3 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 transition duration-200"
              >
                <Trash2 size={24} className="mr-3" />
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <PdfUploadDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onFileSelect={onFileSelect}
        onExtract={onExtract}
      />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Delete Resume</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this resume?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDeleteResume(currentIndex)}
            className="px-4 py-2 text-red-600 hover:text-red-800"
            autoFocus
          >
            Delete
          </button>
        </DialogActions>
      </Dialog>

      {isloading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-lg shadow-xl text-center"
        >
          <p className="mb-4 text-xl font-semibold text-gray-800">
            {currentStatement}
          </p>
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        </motion.div>
      </div>
      )}
    </div>
  );
};

export default BaseResume;