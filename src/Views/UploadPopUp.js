import React, { useState, useRef } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Button, 
  Typography, 
  Box, 
  Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const PdfUploadDialog = ({ open, onClose, onFileSelect,onExtract }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);


  const onExtractText =  () => {

    onExtract(file);

  }

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    if (files[0].type === 'application/pdf') {
      setFile(files[0]);
      setError('');
      onFileSelect(files[0]);
    } else {
      setError('Please upload a PDF file.');
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleClose = () => {
    setFile(null);
    setError('');
    onClose();
    };

return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Upload PDF</DialogTitle>
        <DialogContent>
            <Box
                sx={{
                    border: 2,
                    borderRadius: 2,
                    borderColor: dragActive ? 'primary.main' : 'grey.300',
                    borderStyle: 'dashed',
                    backgroundColor: dragActive ? 'action.hover' : 'background.paper',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 200,
                    '&:hover': {
                        backgroundColor: 'action.hover',
                    },
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {file ? (
                    <div className='flex flex-col space-y-10' >
                        <Typography variant="body1" fontWeight="bold" fontSize={20} >
                        Selected: {file.name}
                    </Typography>

                    <button
                        className="mb-2 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700"
                        onClick={onExtractText}
                    >
                        Extract
                    </button>

                    </div>
                    
                ) : (
                    <>
                        <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="body1" color="text.secondary" align="center" gutterBottom>
                            Click to upload or drag and drop
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center">
                            PDF (MAX. 10MB)
                        </Typography>
                        <input
                            ref={fileInputRef}
                            type="file"
                            style={{ display: 'none' }}
                            accept=".pdf"
                            onChange={handleChange}
                        />
                        <Button variant="contained" onClick={onButtonClick} sx={{ mt: 2 }}>
                            Select File
                        </Button>
                    </>
                )}
            </Box>
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
        </DialogContent>
    </Dialog>
);
};

export default PdfUploadDialog;